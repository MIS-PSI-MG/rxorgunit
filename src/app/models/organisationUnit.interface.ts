export interface OrganisationUnit {
  name: string;
  shortName: string;
  parent?: Parent;
  id: string;
  organisationUnitGroups: Parent[];
  level: number;
  ancestors: Ancestor[];
}

interface Ancestor {
  id: string;
}

interface Parent {
  name: string;
  id: string;
}
