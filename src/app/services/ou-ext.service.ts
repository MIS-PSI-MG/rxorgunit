import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { OrganisationUnit } from '../models/organisationUnit.interface';
import { OrganisationUnitLevel } from '../models/organisationUnitLevel.interface';

@Injectable({
  providedIn: 'root',
})
export class OuExtService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/OU_Min_minified_shortName_2025.json';
  private jsonUrlLevels = 'assets/OU_Levels_Minified.json';
  private levels$!: Observable<OrganisationUnitLevel[]>;
  private units$!: Observable<OrganisationUnit[]>;
  constructor() {
    this.levels$ = this.getOrganisationUnitLevels().pipe(shareReplay(1));
    this.units$ = this.getOrganisationUnits().pipe(shareReplay(1));
  }

  getOrganisationUnitLevels(): Observable<OrganisationUnitLevel[]> {
    return this.http
      .get<{ organisationUnitLevels: OrganisationUnitLevel[] }>(
        this.jsonUrlLevels
      )
      .pipe(map((resp) => resp.organisationUnitLevels));
  }

  getOrganisationUnits(): Observable<OrganisationUnit[]> {
    return this.http
      .get<{ organisationUnits: OrganisationUnit[] }>(this.jsonUrl)
      .pipe(map((resp) => resp.organisationUnits));
  }

  /** Public streams */
  public loadLevels(): Observable<OrganisationUnitLevel[]> {
    return this.levels$;
  }

  public loadAllUnits(): Observable<OrganisationUnit[]> {
    return this.units$;
  }

  loadUnits() {
    return this.units$;
  }

  /**
   * Get units by exact level
   */
  public unitsByLevel(level: number): Observable<OrganisationUnit[]> {
    return this.units$.pipe(
      map((list) => list.filter((ou) => ou.level === level))
    );
  }

  /**
   * Get units one level deeper whose `parent.id` matches
   */
  public unitsByParentAndLevel(
    parentId: string,
    level: number
  ): Observable<OrganisationUnit[]> {
    return this.units$.pipe(
      map((list) =>
        list.filter(
          (ou) =>
            ou.level === level &&
            ((ou.parent && ou.parent.id === parentId) ||
              (ou.ancestors || []).map((a) => a.id).includes(parentId))
        )
      )
    );
  }
}
