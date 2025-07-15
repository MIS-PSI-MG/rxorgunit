import { Routes } from '@angular/router';
import { OrgUnitComponent } from './components/org-unit/org-unit.component';

export const routes: Routes = [
  {
    path: '',
    component: OrgUnitComponent,
  },
  {
    path: 'sou',
    loadComponent: () =>
      import('./components/sou/sou.component').then((m) => m.SouComponent),
  },
];
