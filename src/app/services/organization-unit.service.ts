import { Injectable, signal } from '@angular/core';
import { OrganisationUnit } from '../models/organisationUnit.interface';
import { OrganisationUnitLevel } from '../models/organisationUnitLevel.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationUnitService {
  levels = signal<OrganisationUnitLevel[]>([]);
  organisationUnits = signal<OrganisationUnit[]>([]);

  getUnitsByLevel(level: number) {
    return this.organisationUnits()
      .filter((unit) => unit.level === level)
      .filter((item) => !item.name.toUpperCase().includes('DESACTIVE')); // Filter by shortName if needed
  }

  getChildren(level: number, parentId: string) {
    return this.organisationUnits().filter(
      (unit) => unit.level === level && unit.parent?.id === parentId
    );
  }
  getCHRR(parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('CHRR') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }

  getCSB(parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('CSB') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }

  getCHRD(parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('CHRD') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }

  getFSP(parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('FSP') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }
  getCHU(parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('CHU') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }
}
