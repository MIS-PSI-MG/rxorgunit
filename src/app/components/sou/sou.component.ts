import { MatIconModule } from '@angular/material/icon';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { OrganisationUnit } from '../../models/organisationUnit.interface';
import { OrganisationUnitLevel as OrgUnitLevel } from '../../models/organisationUnitLevel.interface';
import { OuExtService as OrgUnitService } from '../../services/ou-ext.service';
import { startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  templateUrl: './sou.component.html',
  styleUrl: './sou.component.css',
})
export class SouComponent {
  private fb = inject(FormBuilder);
  private orgService = new OrgUnitService();

  form = this.fb.group({
    level: this.fb.control<OrgUnitLevel | null>(null),
    level2Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level3Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level4Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level5Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),
    level6Unit: this.fb.control<OrganisationUnit | null>({
      value: null,
      disabled: true,
    }),

    level2Filter: this.fb.control<OrganisationUnit | string | null>({
      value: null,
      disabled: true,
    }),
    level3Filter: this.fb.control<OrganisationUnit | string | null>({
      value: null,
      disabled: true,
    }),
    level4Filter: this.fb.control<OrganisationUnit | string | null>({
      value: null,
      disabled: true,
    }),
    level5Filter: this.fb.control<OrganisationUnit | string | null>({
      value: null,
      disabled: true,
    }),
    level6Filter: this.fb.control<OrganisationUnit | string | null>({
      value: null,
      disabled: true,
    }),
  });

  levels = signal<OrgUnitLevel[] | null>(null);
  allUnits = signal<OrganisationUnit[]>([]);

  level2Units = signal<OrganisationUnit[]>([]);
  level3Units = signal<OrganisationUnit[]>([]);
  level4Units = signal<OrganisationUnit[]>([]);
  level5Units = signal<OrganisationUnit[]>([]);
  level6Units = signal<OrganisationUnit[]>([]);

  level2FilteredUnits = signal<OrganisationUnit[]>([]);
  level3FilteredUnits = signal<OrganisationUnit[]>([]);
  level4FilteredUnits = signal<OrganisationUnit[]>([]);
  level5FilteredUnits = signal<OrganisationUnit[]>([]);
  level6FilteredUnits = signal<OrganisationUnit[]>([]);

  displayFn = (unit?: OrganisationUnit): string => (unit ? unit.name : '');

  ngOnInit(): void {
    this.orgService.getOrganisationUnitLevels().subscribe(this.levels.set);
    this.orgService.getOrganisationUnits().subscribe((units) => {
      this.allUnits.set(units);
      this.level2Units.set(units.filter((u) => u.level === 2));
      this.form.get('level2Filter')!.setValue('');
    });

    // Enable/Disable Controls with Debugging
    this.form
      .get('level')!
      .valueChanges.subscribe((lvl: OrgUnitLevel | null) => {
        const l = lvl?.level ?? 0;
        console.log('Current Level:', l);

        this.form.patchValue({
          level2Unit: null,
          level3Unit: null,
          level4Unit: null,
          level2Filter: '',
          level3Filter: '',
          level4Filter: '',
          level5Filter: '',
          level6Filter: '',
        });

        this.form.get('level2Filter')?.disable();
        this.form.get('level3Filter')?.disable();
        this.form.get('level4Filter')?.disable();
        this.form.get('level5Filter')?.disable();
        this.form.get('level6Filter')?.disable();

        if (l >= 2) {
          this.form.get('level2Filter')?.enable();
        }
        if (l >= 3) {
          this.form.get('level3Filter')?.enable();
        }
        if (l >= 4) {
          this.form.get('level4Filter')?.enable();
        }
        if (l >= 5) {
          this.form.get('level5Filter')?.enable();
        }
        if (l >= 6) {
          this.form.get('level6Filter')?.enable();
        }
      });

    // Update Level 3 on level2 change
    this.form
      .get('level2Unit')!
      .valueChanges.subscribe((unit: OrganisationUnit | null) => {
        this.form.patchValue({
          level3Unit: null,
          level4Unit: null,
          level3Filter: '',
          level4Filter: '',
          level5Filter: '',
          level6Filter: '',
        });

        if (unit) {
          const list = this.allUnits().filter(
            (u) => u.level === 3 && u.parent?.id === unit.id
          );
          this.level3Units.set(list);
          this.level3FilteredUnits.set(list);
        } else {
          this.level3Units.set([]);
          this.level3FilteredUnits.set([]);
        }
      });

    // Update Level 4 on level3 change
    this.form
      .get('level3Unit')!
      .valueChanges.subscribe((unit: OrganisationUnit | null) => {
        this.form.patchValue({
          level4Unit: null,
          level4Filter: '',
        });

        if (unit) {
          const list = this.allUnits().filter(
            (u) => u.level === 4 && u.parent?.id === unit.id
          );
          this.level4Units.set(list);
          this.level4FilteredUnits.set(list);
        } else {
          this.level4Units.set([]);
          this.level4FilteredUnits.set([]);
        }
      });

    // Update Level 5 on level4 change
    this.form
      .get('level4Unit')!
      .valueChanges.subscribe((unit: OrganisationUnit | null) => {
        if (unit) {
          const list = this.allUnits().filter(
            (u) => u.level === 5 && u.parent?.id === unit.id
          );
          this.level5Units.set(list);
          this.level5FilteredUnits.set(list);
        } else {
          this.level5Units.set([]);
          this.level5FilteredUnits.set([]);
        }
      });

    // Filter logic
    this.form
      .get('level2Filter')!
      .valueChanges.pipe(startWith(''))
      .subscribe((txt) => {
        const filtered = this._filter(txt, this.level2Units());

        this.level2FilteredUnits.set(filtered);
      });

    this.form
      .get('level3Filter')!
      .valueChanges.pipe(startWith(''))
      .subscribe((txt) => {
        const filtered = this._filter(txt, this.level3FilteredUnits());

        this.level3FilteredUnits.set(filtered);
      });

    this.form
      .get('level4Filter')!
      .valueChanges.pipe(startWith(''))
      .subscribe((txt) => {
        const filtered = this._filter(txt, this.level4FilteredUnits());

        this.level4FilteredUnits.set(filtered);
      });

    this.form
      .get('level5Filter')!
      .valueChanges.pipe(startWith(''))
      .subscribe((txt) => {
        const filtered = this._filter(txt, this.level5FilteredUnits());

        this.level5FilteredUnits.set(filtered);
      });

    this.form
      .get('level6Filter')!
      .valueChanges.pipe(startWith(''))
      .subscribe((txt) => {
        const filtered = this._filter(txt, this.level6FilteredUnits());

        this.level6FilteredUnits.set(filtered);
      });
  }
  private _filter(
    name: string | null | OrganisationUnit,
    list: OrganisationUnit[]
  ) {
    if (typeof name === 'string') {
      let filter = name as string;
      let filtered: OrganisationUnit[] = [];
      filtered = list.filter((u) =>
        u.name.toLowerCase().includes(filter.toLowerCase())
      );
      return filtered;
    } else {
      return list;
    }
  }

  clearSelection(level: 'level2' | 'level3' | 'level4' | 'level5' | 'level6') {
    this.form.get(`${level}Filter`)?.setValue('');
    this.form.get(`${level}Unit`)?.setValue(null);
    // Reset the filtered options manually
    switch (level) {
      case 'level2':
        this.level2FilteredUnits.set(this.level2Units());
        this.level3Units.set([]);
        this.level3FilteredUnits.set([]);
        this.level4Units.set([]);
        this.level4FilteredUnits.set([]);
        break;
      case 'level3':
        this.level3FilteredUnits.set(this.level3Units());
        this.level4Units.set([]);
        this.level4FilteredUnits.set([]);
        break;
      case 'level4':
        this.level4FilteredUnits.set(this.level4Units());
        this.level5Units.set([]);
        this.level5FilteredUnits.set([]);
        break;
      case 'level5':
        this.level5FilteredUnits.set(this.level5Units());
        this.level6Units.set([]);
        this.level6FilteredUnits.set([]);
        break;
      case 'level6':
        this.level6FilteredUnits.set(this.level6Units());
        break;
    }
  }
  onOptionSelected(option: OrganisationUnit, level: number) {
    if (level === 2) {
      this.form.patchValue({
        level3Filter: null,
        level4Filter: null,
        level5Filter: null,
      });
      if (option && this.form.get('level3Filter')?.enabled) {
        const units = this.allUnits();
        this.level3FilteredUnits.set(
          units.filter((u) => u.level === 3 && u.parent?.id === option.id)
        );
      } else {
        this.level3FilteredUnits.set([]);
      }
    } else if (level === 3) {
      this.form.patchValue({ level4Filter: null, level5Filter: null });
      if (option && this.form.get('level4Filter')?.enabled) {
        const units = this.allUnits();
        this.level4FilteredUnits.set(
          units.filter((u) => u.level === 4 && u.parent?.id === option.id)
        );
      } else {
        this.level4FilteredUnits.set([]);
      }
    } else if (level === 4) {
      this.form.patchValue({ level5Filter: null });
      if (option && this.form.get('level5Filter')?.enabled) {
        const units = this.allUnits();
        this.level5FilteredUnits.set(
          units.filter((u) => u.level === 5 && u.parent?.id === option.id)
        );
      } else {
        this.level5FilteredUnits.set([]);
      }
    } else if (level === 5) {
      this.form.patchValue({ level6Filter: null });
      if (option && this.form.get('level6Filter')?.enabled) {
        const units = this.allUnits();
        this.level6FilteredUnits.set(
          units.filter((u) => u.level === 6 && u.parent?.id === option.id)
        );
      } else {
        this.level6FilteredUnits.set([]);
      }
    }
  }
}
