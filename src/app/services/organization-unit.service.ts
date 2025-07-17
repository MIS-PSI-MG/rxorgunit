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
  getGrandChildren(level: number, parentId: string) {
    return this.organisationUnits().filter(
      (unit) =>
        unit.level === level &&
        unit.ancestors.some((ancestor) => ancestor.id === parentId)
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

  getCP(CP: string, parentId: string) {
    return this.organisationUnits().find(
      (unit) =>
        unit.name.includes(CP) && unit.ancestors.some((a) => a.id === parentId)
    );
  }

  getCHRD_District(parentId: string) {
    return this.organisationUnits().filter(
      (unit) =>
        unit.level === 5 &&
        unit.name.includes('CHRD') &&
        unit.ancestors.some((a) => a.id === parentId)
    );
  }
}
