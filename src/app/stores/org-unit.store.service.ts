import { Injectable, signal } from '@angular/core';
import { OrganisationUnit } from '../models/organisationUnit.interface';
import { OUForm } from '../models/OUForm.interface';

@Injectable({
  providedIn: 'root',
})
export class OrgUnitStoreService {
  OUForm = signal<OUForm>({
    level: null,
    level1: null,
    level2: null,
    level3: null,
    level4: null,
    CHRR: null,
    CHRD: null,
    CSB: null,
    Fokontany: null,
    CHU: null,
  });
}
