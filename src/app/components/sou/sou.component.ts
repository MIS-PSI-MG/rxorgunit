import { MatIconModule } from '@angular/material/icon';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { OrganisationUnit } from '../../models/organisationUnit.interface';
import { OrganisationUnitLevel as OrgUnitLevel } from '../../models/organisationUnitLevel.interface';
import { OuExtService as OrgUnitService } from '../../services/ou-ext.service';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sou',
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
  templateUrl: './sou.component.html',
  styleUrl: './sou.component.css',
})
export class SouComponent {
  private orgService = inject(OrgUnitService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    level: this.fb.control<OrgUnitLevel | null>(null),
    level2Filter: this.fb.control<string>({ value: '', disabled: true }),
    level2Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level3Filter: this.fb.control<string>({ value: '', disabled: true }),
    level3Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level4Filter: this.fb.control<string>({ value: '', disabled: true }),
    level4Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
  });

  levels$ = this.orgService.getOrganisationUnitLevels().pipe(shareReplay(1));
  allUnits$ = this.orgService.getOrganisationUnits().pipe(shareReplay(1));

  filtered2$!: Observable<OrganisationUnit[]>;
  filtered3$!: Observable<OrganisationUnit[]>;
  filtered4$!: Observable<OrganisationUnit[]>;

  ngOnInit() {
    const level$ = this.form.controls.level.valueChanges.pipe(startWith(null));

    const level2List$ = combineLatest([level$, this.allUnits$]).pipe(
      map(([lvl, units]) =>
        lvl && lvl.level >= 2 ? units.filter((u) => u.level === 2) : []
      ),
      shareReplay(1)
    );

    this.filtered2$ = combineLatest([
      this.form.controls.level2Filter.valueChanges.pipe(startWith('')),
      level2List$,
    ]).pipe(map(([term, list]) => this._filterUnits(term, list)));

    const parent2$ = this.form.controls.level2Unit.valueChanges.pipe(
      startWith(null)
    );

    const level3List$ = combineLatest([parent2$, this.allUnits$]).pipe(
      map(([parent, units]) =>
        parent
          ? units.filter((u) => u.level === 3 && u.parent?.id === parent.id)
          : []
      ),
      shareReplay(1)
    );

    this.filtered3$ = combineLatest([
      this.form.controls.level3Filter.valueChanges.pipe(startWith('')),
      level3List$,
    ]).pipe(map(([term, list]) => this._filterUnits(term, list)));

    const parent3$ = this.form.controls.level3Unit.valueChanges.pipe(
      startWith(null)
    );

    const level4List$ = combineLatest([parent3$, this.allUnits$]).pipe(
      map(([parent, units]) =>
        parent
          ? units.filter((u) => u.level === 4 && u.parent?.id === parent.id)
          : []
      ),
      shareReplay(1)
    );

    this.filtered4$ = combineLatest([
      this.form.controls.level4Filter.valueChanges.pipe(startWith('')),
      level4List$,
    ]).pipe(map(([term, list]) => this._filterUnits(term, list)));

    // Enable/disable controls based on level and parents
    level$.subscribe((lvl) => this._setLevelControls(lvl?.level ?? 0));
    parent2$.subscribe((p) => this._toggleControl('level3', !!p));
    parent3$.subscribe((p) => this._toggleControl('level4', !!p));
  }

  private _filterUnits(
    term: string | null,
    list: OrganisationUnit[]
  ): OrganisationUnit[] {
    const filter = (term || '').toLowerCase();
    return list.filter(
      (o) =>
        o.name.toLowerCase().includes(filter) ||
        o.shortName.toLowerCase().includes(filter)
    );
  }

  private _setLevelControls(level: number) {
    ['level2', 'level3', 'level4'].forEach((lvlKey, idx) => {
      const filterKey = `${lvlKey}Filter` as keyof typeof this.form.controls;
      const unitKey = `${lvlKey}Unit` as keyof typeof this.form.controls;
      const ctrlFilter = this.form.controls[filterKey];
      const ctrlUnit = this.form.controls[unitKey];
      if (level >= idx + 2) {
        ctrlFilter.enable();
        ctrlUnit.enable();
      } else {
        ctrlFilter.disable();
        ctrlUnit.disable();
        (ctrlFilter as any).setValue('');
        ctrlUnit.setValue(null);
      }
    });
  }

  private _toggleControl(prefix: 'level3' | 'level4', enabled: boolean) {
    const flt = this.form.controls[`${prefix}Filter`];
    const unt = this.form.controls[`${prefix}Unit`];
    if (enabled) {
      flt.enable();
      unt.enable();
    } else {
      flt.disable();
      unt.disable();
      flt.setValue('');
      unt.setValue(null);
    }
  }

  displayFn = (unit?: OrganisationUnit): string => (unit ? unit.name : '');
}
