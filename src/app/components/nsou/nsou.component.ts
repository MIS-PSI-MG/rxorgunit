import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrganisationUnit } from '../../models/organisationUnit.interface';
import { OrganisationUnitLevel } from '../../models/organisationUnitLevel.interface';
import { OuExtService as OrgUnitService } from '../../services/ou-ext.service';
import { startWith, switchMap, map, combineLatest } from 'rxjs';
import { Observable, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-nsou',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './nsou.component.html',
  styleUrl: './nsou.component.css',
})
export class NsouComponent {
  private fb = inject(FormBuilder);
  private orgService = new OrgUnitService();

  form: FormGroup;
  levels$: Observable<OrganisationUnitLevel[]>;
  allUnits$: Observable<OrganisationUnit[]>;

  level2Units$: Observable<OrganisationUnit[]>;
  level3Units$: Observable<OrganisationUnit[]>;
  level4Units$: Observable<OrganisationUnit[]>;

  level2FilteredUnits$: Observable<OrganisationUnit[]>;
  level3FilteredUnits$: Observable<OrganisationUnit[]>;
  level4FilteredUnits$: Observable<OrganisationUnit[]>;

  displayFn = (unit?: OrganisationUnit): string => (unit ? unit.name : '');

  constructor() {
    this.form = this.fb.group({
      level: [null],
      level2Unit: [{ value: null, disabled: true }],
      level3Unit: [{ value: null, disabled: true }],
      level4Unit: [{ value: null, disabled: true }],
      level2Filter: [{ value: '', disabled: true }],
      level3Filter: [{ value: '', disabled: true }],
      level4Filter: [{ value: '', disabled: true }],
    });

    this.levels$ = this.orgService.getOrganisationUnitLevels();
    this.allUnits$ = this.orgService.getOrganisationUnits();

    this.level2Units$ = this.allUnits$.pipe(
      map((units) => units.filter((u) => u.level === 2))
    );

    this.level3Units$ = this.form.get('level2Unit')!.valueChanges.pipe(
      startWith(null),
      switchMap((level2Unit) => {
        if (level2Unit) {
          return this.allUnits$.pipe(
            map((units) =>
              units.filter(
                (u) => u.level === 3 && u.parent?.id === level2Unit.id
              )
            )
          );
        }
        return of([]);
      })
    );

    this.level4Units$ = this.form.get('level3Unit')!.valueChanges.pipe(
      startWith(null),
      switchMap((level3Unit) => {
        if (level3Unit) {
          return this.allUnits$.pipe(
            map((units) =>
              units.filter(
                (u) => u.level === 4 && u.parent?.id === level3Unit.id
              )
            )
          );
        }
        return of([]);
      })
    );

    this.level2FilteredUnits$ = combineLatest([
      this.form.get('level2Filter')!.valueChanges.pipe(startWith('')),
      this.level2Units$,
    ]).pipe(map(([filter, units]) => this._filter(filter, units)));

    this.level3FilteredUnits$ = combineLatest([
      this.form.get('level3Filter')!.valueChanges.pipe(startWith('')),
      this.level3Units$,
    ]).pipe(map(([filter, units]) => this._filter(filter, units)));

    this.level4FilteredUnits$ = combineLatest([
      this.form.get('level4Filter')!.valueChanges.pipe(startWith('')),
      this.level4Units$,
    ]).pipe(map(([filter, units]) => this._filter(filter, units)));
  }

  ngOnInit(): void {
    this.form.get('level')!.valueChanges.subscribe((lvl) => {
      const l = lvl?.level ?? 0;
      this.form.patchValue({
        level2Unit: null,
        level3Unit: null,
        level4Unit: null,
        level2Filter: '',
        level3Filter: '',
        level4Filter: '',
      });

      this.form.get('level2Filter')?.disable();
      this.form.get('level3Filter')?.disable();
      this.form.get('level4Filter')?.disable();

      if (l >= 2) {
        this.form.get('level2Filter')?.enable();
      }
      if (l >= 3) {
        this.form.get('level3Filter')?.enable();
      }
      if (l >= 4) {
        this.form.get('level4Filter')?.enable();
      }
    });

    this.form.get('level2Unit')!.valueChanges.subscribe(() => {
      this.form.patchValue({
        level3Unit: null,
        level4Unit: null,
        level3Filter: '',
        level4Filter: '',
      });
    });

    this.form.get('level3Unit')!.valueChanges.subscribe(() => {
      this.form.patchValue({
        level4Unit: null,
        level4Filter: '',
      });
    });
  }

  onLevel2Selected(event: MatAutocompleteSelectedEvent) {
    const unit = event.option.value as OrganisationUnit;
    this.form.get('level2Unit')!.setValue(unit);
    this.form.get('level2Filter')!.setValue(unit.name);
  }

  onLevel3Selected(event: MatAutocompleteSelectedEvent) {
    const unit = event.option.value as OrganisationUnit;
    this.form.get('level3Unit')!.setValue(unit);
    this.form.get('level3Filter')!.setValue(unit.name);
  }

  onLevel4Selected(event: MatAutocompleteSelectedEvent) {
    const unit = event.option.value as OrganisationUnit;
    this.form.get('level4Unit')!.setValue(unit);
    this.form.get('level4Filter')!.setValue(unit.name);
  }

  private _filter(
    filter: string,
    list: OrganisationUnit[]
  ): OrganisationUnit[] {
    if (filter) {
      return list.filter((u) =>
        u.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return list;
  }

  clearSelection(level: 'level2' | 'level3' | 'level4') {
    this.form.get(`${level}Filter`)?.setValue('');
    this.form.get(`${level}Unit`)?.setValue(null);
  }
}
