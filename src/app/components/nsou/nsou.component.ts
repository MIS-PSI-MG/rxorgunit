import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  startWith,
  tap,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  filter,
} from 'rxjs/operators';
import { OrganisationUnitLevel } from '../../models/organisationUnitLevel.interface';
import { OrganisationUnit } from '../../models/organisationUnit.interface';
import { OuExtService as OrgUnitService } from '../../services/ou-ext.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-nsou',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    AsyncPipe,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './nsou.component.html',
  styleUrl: './nsou.component.css',
})
export class NsouComponent implements OnInit {
  private svc = inject(OrgUnitService);

  /** Form for selecting organisation units */
  form = new FormGroup({
    level: new FormControl<OrganisationUnitLevel | null>(null),
    ou1: new FormControl<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    ou2: new FormControl<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    ou3: new FormControl<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
  });

  levels$ = this.svc.loadLevels();
  unitsAll$ = this.svc.loadUnits();

  filtered1$!: Observable<OrganisationUnit[]>;
  filtered2$!: Observable<OrganisationUnit[]>;
  filtered3$!: Observable<OrganisationUnit[]>;

  ngOnInit() {
    this.form.controls.level.valueChanges.subscribe((lvl) => {
      this.form.controls.ou1.reset();
      this.form.controls.ou1.enable();

      this.form.controls.ou2.reset();
      this.form.controls.ou2.disable();
      this.form.controls.ou3.reset();
      this.form.controls.ou3.disable();
    });

    this.form.controls.ou1.valueChanges.subscribe((parent) => {
      if (parent) {
        this.form.controls.ou2.enable();
      } else {
        this.form.controls.ou2.disable();
        this.form.controls.ou3.disable();
      }
    });

    this.form.controls.ou2.valueChanges.subscribe((parent) => {
      if (parent) {
        this.form.controls.ou3.enable();
      } else {
        this.form.controls.ou3.disable();
      }
    });
  }

  private filterUnits(
    input: OrganisationUnit | string,
    level: number,
    parentId: string | null
  ): Observable<OrganisationUnit[]> {
    const text =
      typeof input === 'string' ? input : input?.name || input?.shortName || '';
    const filterText = text.toLowerCase().trim();

    return this.unitsAll$.pipe(
      map((list) =>
        list.filter(
          (ou) =>
            ou.level === level &&
            (!parentId || ou.parent?.id === parentId) &&
            (ou.name.toLowerCase().includes(filterText) ||
              ou.shortName.toLowerCase().includes(filterText))
        )
      )
    );
  }

  private resetAll() {
    ['ou1', 'ou2', 'ou3'].forEach((c) => {
      const key = c as keyof typeof this.form.controls;
      this.form.controls[key].reset();
      this.form.controls[key].disable();
    });
    const lvl = this.form.controls.level.value;
    if (lvl) this.enable('ou1');
  }

  private resetControl(...ctrls: Array<'ou1' | 'ou2' | 'ou3'>) {
    ctrls.forEach((c) => {
      this.form.controls[c].reset();
      this.form.controls[c].disable();
    });
  }

  private enable(ctrl: 'ou1' | 'ou2' | 'ou3') {
    this.form.controls[ctrl].enable();
  }

  displayOU(ou: OrganisationUnit | string): string {
    return typeof ou === 'string' ? ou : ou?.name || '';
  }

  displayLevel(lvl: OrganisationUnitLevel | null) {
    return lvl ? `${lvl.name} (L${lvl.level})` : '';
  }
}
