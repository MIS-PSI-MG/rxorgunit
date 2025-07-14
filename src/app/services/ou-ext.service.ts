import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrganisationUnit } from '../models/organisationUnit.interface';
import { OrganisationUnitLevel } from '../models/organisationUnitLevel.interface';

@Injectable({
  providedIn: 'root',
})
export class OuExtService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/OU_Min_minified_shortName_2025.json';
  private jsonUrlLevels = 'assets/OU_Levels_Minified.json';

  getOrganisationUnitLevels(): Observable<OrganisationUnitLevel[]> {
    return this.http
      .get<{ organisationUnitLevels: OrganisationUnitLevel[] }>(
        this.jsonUrlLevels
      )
      .pipe(map((response) => response.organisationUnitLevels));
  }
  getOrganisationUnits(): Observable<OrganisationUnit[]> {
    return this.http
      .get<{ organisationUnits: OrganisationUnit[] }>(this.jsonUrl)
      .pipe(map((response) => response.organisationUnits));
  }
}
