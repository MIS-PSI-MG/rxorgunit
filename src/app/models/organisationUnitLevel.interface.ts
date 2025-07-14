export enum OrgUnitLevelName {
  NATIONAL = 'National',
  REGION = 'Région',
  DISTRICT = 'District',
  COMMUNE = 'Commune',
  FORMATIONS_SANITAIRES = 'Formations Sanitaires',
  FOKONTANY = 'Fokontany',
}

export interface OrganisationUnitLevel {
  id: string;
  name: string;
  created?: Date;
  lastUpdated?: Date;
  translations?: any[];
  level: number;
  offlineLevels?: number;
}
