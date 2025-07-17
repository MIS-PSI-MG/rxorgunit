import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, startWith, pairwise, tap } from 'rxjs/operators';
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
    level4: [{ value: null as OrganisationUnit | null, disabled: true }],
    level5: [{ value: null as OrganisationUnit | null, disabled: true }],
    CHRR: [{ value: null as OrganisationUnit | null, disabled: true }],
    CHRD: [{ value: null as OrganisationUnit | null, disabled: true }],
    CSB: [{ value: null as OrganisationUnit | null, disabled: true }],
    Fokontany: [{ value: null as OrganisationUnit | null, disabled: true }],
    CHU: [{ value: null as OrganisationUnit | null, disabled: true }],
  });

  // Signals for options arrays
  levelOptions = this.orgService.levels;
  level1Options = signal<OrganisationUnit[]>([]);
  level2Options = signal<OrganisationUnit[]>([]);
  level3Options = signal<OrganisationUnit[]>([]);
  level4Options = signal<OrganisationUnit[]>([]);
  CHRROptions = signal<OrganisationUnit[]>([]);
  CHRDOptions = signal<OrganisationUnit[]>([]);
  CSBOptions = signal<OrganisationUnit[]>([]);
  FokontanyOptions = signal<OrganisationUnit[]>([]);
  CHUOptions = signal<OrganisationUnit[]>([]);

  level1FilteredOptions = signal<OrganisationUnit[]>([]);
  level2FilteredOptions = signal<OrganisationUnit[]>([]);
  level3FilteredOptions = signal<OrganisationUnit[]>([]);
  level4FilteredOptions = signal<OrganisationUnit[]>([]);
  CHRRFilteredOptions = signal<OrganisationUnit[]>([]);
  CHRDFilteredOptions = signal<OrganisationUnit[]>([]);
  CSBFilteredOptions = signal<OrganisationUnit[]>([]);
  FokontanyFilteredOptions = signal<OrganisationUnit[]>([]);
  CHUFilteredOptions = signal<OrganisationUnit[]>([]);

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
    const level3$ = this.form
      .get('level3')!
      .valueChanges.pipe(startWith(this.form.get('level3')!.value));
    const level4$ = this.form
      .get('level4')!
      .valueChanges.pipe(startWith(this.form.get('level4')!.value));
    const CHRR$ = this.form
      .get('CHRR')!
      .valueChanges.pipe(startWith(this.form.get('CHRR')!.value));
    const CHU$ = this.form
      .get('CHU')!
      .valueChanges.pipe(startWith(this.form.get('CHU')!.value));
    const CHRD$ = this.form
      .get('CHRD')!
      .valueChanges.pipe(startWith(this.form.get('CHRD')!.value));
    const CSB$ = this.form
      .get('CSB')!
      .valueChanges.pipe(startWith(this.form.get('CSB')!.value));
    const Fokontany$ = this.form
      .get('Fokontany')!
      .valueChanges.pipe(startWith(this.form.get('Fokontany')!.value));

    // Control enabling/disabling inputs based on level selected
    level$.subscribe((level) => {
      const lvl = level?.level ?? 0;
      this.updateFormState(lvl);
    });

    // Update options reactively when level, level1, or level2 change
    combineLatest([
      level$,
      level1$,
      level2$,
      level3$,
      level4$,
      CHRR$,
      CHRD$,
      CSB$,
      Fokontany$,
      CHU$,
    ])
      .pipe(
        map(([level, l1, l2, l3, l4, CHRR, CHRD, CSB, Fokontany, CHU]) => {
          const lvl = level?.level ?? 0;
          const opts1 = lvl >= 2 ? this.orgService.getUnitsByLevel(2) : [];
          const opts2 =
            lvl >= 3 && l1 ? this.orgService.getChildren(3, l1.id) : [];
          const opts3 =
            lvl >= 4 && l2 ? this.orgService.getChildren(4, l2.id) : [];
          const opts4 =
            lvl >= 5 && l3 ? this.orgService.getChildren(5, l3.id) : [];
          const CHRROpts =
            lvl >= 21 && l1 ? this.orgService.getCP('CHRR', l1.id) : [];
          const CHUOpts =
            lvl >= 51 && l1 ? this.orgService.getCP('CHU', l1.id) : [];

          const CHRDOpts =
            lvl >= 31 && l2 !== null
              ? this.orgService.getCHRD_District(l2.id)
              : [];
          const CSBOpts =
            lvl >= 41 && l3 !== null ? this.orgService.getCP('CSB', l3.id) : [];
          const FokontanyOpts =
            lvl >= 6 && l3 !== null
              ? this.orgService.getGrandChildren(6, l3.id)
              : [];

          // Return the options for each level
          return {
            opts1,
            opts2,
            opts3,
            opts4,
            CHRROpts,
            CHRDOpts,
            CSBOpts,
            CHUOpts,
            FokontanyOpts,
            level,
            l1,
            l2,
            l3,
            l4,
            CHRR,
            CHRD,
            CSB,
            Fokontany,
            CHU,
          };
        }),
        // Use pairwise to compare previous and current emissions
        pairwise(),
        // Detect changes and reset dependent controls
        tap(
          ([
            {
              level: prevLevel,
              l1: prevL1,
              l2: prevL2,
              l3: prevL3,
              l4: prevL4,
              CHRR: prevCHRR,
              CSB: prevCSB,
              Fokontany: prevFokontany,
              CHRD: prevCHRD,
              CHU: prevCHU,
            },
            {
              opts1,
              opts2,
              opts3,
              opts4,
              CHRROpts,
              level,
              l1,
              l2,
              l3,
              l4,
              CHRDOpts,
              CSBOpts,
              FokontanyOpts,
              CHUOpts,
            },
          ]) => {
            // Reset subsequent controls if a higher-level control changes
            if (prevLevel?.level !== level?.level) {
              for (let lv of [
                'level1',
                'level2',
                'level3',
                'level4',
                'CHRR',
                'CHRD',
                'CSB',
                'Fokontany',
                'CHU',
              ]) {
                this.updateLevelReset(lv);
              }
            } else if (prevL1?.id !== l1?.id) {
              for (let lv of [
                'level2',
                'level3',
                'level4',
                'CHRR',
                'CHRD',
                'CSB',
                'Fokontany',
                'CHU',
              ]) {
                this.updateLevelReset(lv);
              }
            } else if (prevL2?.id !== l2?.id) {
              for (let lv of [
                'level3',
                'level4',
                'CHRR',
                'CHRD',
                'CSB',
                'Fokontany',
                'CHU',
              ]) {
                this.updateLevelReset(lv);
              }
            } else if (prevL3?.id !== l3?.id) {
              for (let lv of [
                'level4',
                'CHRR',
                'CHRD',
                'CSB',
                'Fokontany',
                'CHU',
              ]) {
                this.updateLevelReset(lv);
              }
            } else if (prevL4?.id !== l4?.id) {
              for (let lv of ['CHRR', 'CHRD', 'CSB', 'Fokontany', 'CHU']) {
                this.updateLevelReset(lv);
              }
            }

            // Update options and filtered options
            this.level1Options.set(opts1);
            this.level2Options.set(opts2);
            this.level3Options.set(opts3);
            this.level4Options.set(opts4);
            this.CHRROptions.set(
              Array.isArray(CHRROpts) ? CHRROpts : CHRROpts ? [CHRROpts] : []
            );
            this.CHUOptions.set(
              Array.isArray(CHUOpts) ? CHUOpts : CHUOpts ? [CHUOpts] : []
            );
            this.CHRDOptions.set(
              Array.isArray(CHRDOpts) ? CHRDOpts : CHRDOpts ? [CHRDOpts] : []
            );

            this.level1FilteredOptions.set(opts1);
            this.level2FilteredOptions.set(opts2);
            this.level3FilteredOptions.set(opts3);
            this.level4FilteredOptions.set(opts4);
            this.CHRRFilteredOptions.set(
              Array.isArray(CHRROpts) ? CHRROpts : CHRROpts ? [CHRROpts] : []
            );
            this.CHUFilteredOptions.set(
              Array.isArray(CHUOpts) ? CHUOpts : CHUOpts ? [CHUOpts] : []
            );
            this.CHRDFilteredOptions.set(
              Array.isArray(CHRDOpts) ? CHRDOpts : CHRDOpts ? [CHRDOpts] : []
            );
            this.CSBOptions.set(
              Array.isArray(CSBOpts) ? CSBOpts : CSBOpts ? [CSBOpts] : []
            );
            this.CSBFilteredOptions.set(
              Array.isArray(CSBOpts) ? CSBOpts : CSBOpts ? [CSBOpts] : []
            );
            this.FokontanyOptions.set(
              Array.isArray(FokontanyOpts)
                ? FokontanyOpts
                : FokontanyOpts
                ? [FokontanyOpts]
                : []
            );
            this.FokontanyFilteredOptions.set(
              Array.isArray(FokontanyOpts)
                ? FokontanyOpts
                : FokontanyOpts
                ? [FokontanyOpts]
                : []
            );
          }
        )
      )
      .subscribe();
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
    for (let i = 1; i <= 5; i++) {
      this.form.get(`level${i}`)?.disable();
      this.form.get(`level${i}`)?.reset();
    }
    this.form.get('CHRR')?.disable();
    this.form.get('CHRR')?.reset();
    this.form.get('CHRD')?.disable();
    this.form.get('CHRD')?.reset();
    this.form.get('CSB')?.disable();
    this.form.get('CSB')?.reset();
    this.form.get('Fokontany')?.disable();
    this.form.get('Fokontany')?.reset();

    if (level >= 2) this.form.get('level1')?.enable();
    if (level >= 3) this.form.get('level2')?.enable();
    if (level >= 4) this.form.get('level3')?.enable();
    if (level >= 5) this.form.get('level4')?.enable();
    if (level >= 6) {
      this.form.get('Fokontany')?.enable();
      this.form.get('level4')?.disable();
    }
    if (level >= 21) {
      this.form.get('level1')?.enable();
      this.form.get('CHRR')?.enable();
      this.form.get('Fokontany')?.disable();
      for (let i = 2; i <= 5; i++) {
        this.form.get(`level${i}`)?.disable();
      }
    }
    if (level >= 31) {
      this.form.get('level1')?.enable();
      this.form.get('level2')?.enable();
      this.form.get('CHRD')?.enable();
      this.form.get('CHRR')?.disable();
      this.form.get('Fokontany')?.disable();
      for (let i = 3; i <= 5; i++) {
        this.form.get(`level${i}`)?.disable();
      }
    }
    if (level >= 41) {
      for (let i = 1; i <= 3; i++) {
        this.form.get(`level${i}`)?.enable();
      }
      this.form.get('CHRD')?.disable();
      this.form.get('CHRR')?.disable();
      this.form.get('Fokontany')?.disable();
      this.form.get('CSB')?.enable();
    }
  }

  private updateLevelReset(levelForm: string) {
    this.form.get(levelForm)?.reset();
  }

  displayFn = (unit: OrganisationUnit) => unit?.name ?? '';
  // compareFn = (a: OrganisationUnit, b: OrganisationUnit) => a?.id === b?.id;

  filterLevel1Options(inputValue: Event) {
    const target = inputValue.target as HTMLInputElement | null;
    const inpValue = target?.value ?? '';
    if (inpValue) {
      const options = this.level1Options();
      const filtered = this.filter(target, options);
      this.level1FilteredOptions.set(filtered);
    } else {
      this.level1FilteredOptions.set(this.level1Options());
    }
  }
  filterLevel2Options(inputValue: Event) {
    const target = inputValue.target as HTMLInputElement | null;
    const inpValue = target?.value ?? '';
    if (inpValue) {
      const options = this.level2Options();
      const filtered = this.filter(target, options);
      this.level2FilteredOptions.set(filtered);
    }
  }

  filterLevel3Options(inputValue: Event) {
    const options = this.level3Options();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.level3FilteredOptions.set(filtered);
  }
  filterLevel4Options(inputValue: Event) {
    const options = this.level4Options();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.level4FilteredOptions.set(filtered);
  }

  filterCHRROptions(inputValue: Event) {
    const options = this.CHRROptions();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.CHRRFilteredOptions.set(filtered);
  }

  filterCHRDOptions(inputValue: Event) {
    const options = this.CHRDOptions();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.CHRDFilteredOptions.set(filtered);
  }

  filterCSBOptions(inputValue: Event) {
    const options = this.CSBOptions();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.CSBFilteredOptions.set(filtered);
  }
  filterFokontanyOptions(inputValue: Event) {
    const options = this.FokontanyOptions();
    const target = inputValue.target as HTMLInputElement | null;
    const filtered = this.filter(target, options);
    this.FokontanyFilteredOptions.set(filtered);
  }

  private filter(target: HTMLInputElement | null, options: OrganisationUnit[]) {
    const value = target?.value ?? '';
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(value.toLowerCase())
    );
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
