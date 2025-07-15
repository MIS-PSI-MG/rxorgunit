import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrganisationUnit } from '../../models/organisationUnit.interface';
import { OrganisationUnitLevel as OrgUnitLevel } from '../../models/organisationUnitLevel.interface';
import { OrganizationUnitService as OrgDataService } from '../../services/organization-unit.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { OuExtService } from '../../services/ou-ext.service';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule if you want to use buttons

// Removed invalid import of MatForm
@Component({
  selector: 'app-org-unit',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './org-unit.component.html',
  styleUrls: ['./org-unit.component.css'],
})
export class OrgUnitComponent implements OnInit {
  fb = inject(FormBuilder);
  orgService = inject(OrgDataService);
  ouExtService = inject(OuExtService);

  form = this.fb.group({
    level: [null as OrgUnitLevel | null, Validators.required],
    level1: [{ value: null as OrganisationUnit | null, disabled: true }],
    level2: [{ value: null as OrganisationUnit | null, disabled: true }],
    level3: [{ value: null as OrganisationUnit | null, disabled: true }],
  });

  // Signals for options arrays
  levelOptions = this.orgService.levels;
  level1Options = signal<OrganisationUnit[]>([]);
  level2Options = signal<OrganisationUnit[]>([]);
  level3Options = signal<OrganisationUnit[]>([]);
  level2FilteredOptions = signal<OrganisationUnit[]>([]);
  level3FilteredOptions = signal<OrganisationUnit[]>([]);

  constructor() {
    const level$ = this.form
      .get('level')!
      .valueChanges.pipe(startWith(this.form.get('level')!.value));
    const level1$ = this.form
      .get('level1')!
      .valueChanges.pipe(startWith(this.form.get('level1')!.value));
    const level2$ = this.form
      .get('level2')!
      .valueChanges.pipe(startWith(this.form.get('level2')!.value));

    // Control enabling/disabling inputs based on level selected
    level$.subscribe((level) => {
      const lvl = level?.level ?? 0;
      this.updateFormState(lvl);
    });

    // Update options reactively when level, level1, or level2 change
    combineLatest([level$, level1$, level2$])
      .pipe(
        map(([level, l1, l2]) => {
          const lvl = level?.level ?? 0;
          console.log('Selected Level:', lvl);
          const opts1 = lvl >= 2 ? this.orgService.getUnitsByLevel(2) : [];
          const opts2 =
            lvl >= 3 && l1 ? this.orgService.getChildren(3, l1.id) : [];
          const opts3 =
            lvl >= 4 && l2 ? this.orgService.getChildren(4, l2.id) : [];
          // Return the options for each level
          return { opts1, opts2, opts3 };
        })
      )
      .subscribe(({ opts1, opts2, opts3 }) => {
        console.log('Options for Level 1:', opts1.length);
        this.level1Options.set(opts1);
        this.level2Options.set(opts2);

        this.level3Options.set(opts3);
        this.level2FilteredOptions.set(opts2);
        this.level3FilteredOptions.set(opts3);
      });
  }

  ngOnInit(): void {
    this.ouExtService.getOrganisationUnits().subscribe((units) => {
      this.orgService.organisationUnits.set(Array.isArray(units) ? units : []);
    });
    this.ouExtService.getOrganisationUnitLevels().subscribe((lvl) => {
      this.orgService.levels.set(Array.isArray(lvl) ? lvl : []);
    });
  }

  private updateFormState(level: number) {
    this.form.get('level1')?.reset();
    this.form.get('level2')?.reset();
    this.form.get('level3')?.reset();

    this.form.get('level1')?.disable();
    this.form.get('level2')?.disable();
    this.form.get('level3')?.disable();

    if (level >= 2) this.form.get('level1')?.enable();
    if (level >= 3) this.form.get('level2')?.enable();
    if (level >= 4) this.form.get('level3')?.enable();
  }

  private updateLevel2Reset() {
    this.form.get('level2')?.reset();
  }

  displayFn = (unit: OrganisationUnit) => unit?.name ?? '';
  // compareFn = (a: OrganisationUnit, b: OrganisationUnit) => a?.id === b?.id;

  filterLevel2Options(inputValue: Event) {
    const target = inputValue.target as HTMLInputElement | null;
    const inpValue = target?.value ?? '';
    if (inpValue) {
      const options = this.level2Options();
      const filtered = options.filter((opt) =>
        opt.name.toLowerCase().includes(inpValue.toLowerCase())
      );
      this.level2FilteredOptions.set(filtered);
    }
  }

  filterLevel3Options(inputValue: Event) {
    const options = this.level3Options();
    const target = inputValue.target as HTMLInputElement | null;
    const value = target?.value ?? '';
    const filtered = options.filter((opt) =>
      opt.name.toLowerCase().includes(value.toLowerCase())
    );
    this.level3FilteredOptions.set(filtered);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('Form submitted with value:', formValue);
      // Handle form submission logic here
      this.form.reset(); // Reset the form after submission
    } else {
      console.error('Form is invalid');
    }
  }
}
