import { TestBed } from '@angular/core/testing';

import { OrgUnitStoreService } from './org-unit.store.service';

describe('OrgUnitStoreService', () => {
  let service: OrgUnitStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgUnitStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
