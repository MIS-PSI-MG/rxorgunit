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
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-sou',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
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
  });

  levels = signal<OrgUnitLevel[] | null>(null);
  allUnits = signal<OrganisationUnit[]>([]);

  level2Units = signal<OrganisationUnit[]>([]);
  level3Units = signal<OrganisationUnit[]>([]);
  level4Units = signal<OrganisationUnit[]>([]);

  ngOnInit(): void {
    this.orgService.getOrganisationUnitLevels().subscribe(this.levels.set);
    this.orgService.getOrganisationUnits().subscribe((units) => {
      this.allUnits.set(units);
      this.level2Units.set(units.filter((u) => u.level === 2));
    });

    this.form
      .get('level')!
      .valueChanges.subscribe((lvl: OrgUnitLevel | null) => {
        const selectedLevel = lvl?.level ?? 0;

        // Reset all fields
        this.form.patchValue({
          level2Unit: null,
          level3Unit: null,
          level4Unit: null,
        });

        this.form.get('level2Unit')!.disable();
        this.form.get('level3Unit')!.disable();
        this.form.get('level4Unit')!.disable();

        if (selectedLevel >= 2) this.form.get('level2Unit')!.enable();
        if (selectedLevel >= 3) this.form.get('level3Unit')!.enable();
        if (selectedLevel >= 4) this.form.get('level4Unit')!.enable();
      });

    this.form
      .get('level2Unit')!
      .valueChanges.subscribe((selected: OrganisationUnit | null) => {
        this.form.patchValue({ level3Unit: null });
        if (selected) {
          const units = this.allUnits();
          this.level3Units.set(
            units.filter((u) => u.level === 3 && u.parent?.id === selected.id)
          );
        } else {
          this.level3Units.set([]);
        }
      });

    this.form
      .get('level3Unit')!
      .valueChanges.subscribe((selected: OrganisationUnit | null) => {
        this.form.patchValue({ level4Unit: null });
        if (selected) {
          const units = this.allUnits();
          this.level4Units.set(
            units.filter((u) => u.level === 4 && u.parent?.id === selected.id)
          );
        } else {
          this.level4Units.set([]);
        }
      });
  }
  displayFn = (unit?: OrganisationUnit): string => (unit ? unit.name : '');
  private _filter(
    value: string,
    options: OrganisationUnit[]
  ): OrganisationUnit[] {
    const filterValue = value.toLowerCase();

    return options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
