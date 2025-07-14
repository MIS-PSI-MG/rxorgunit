import { TestBed } from '@angular/core/testing';

import { OuExtService } from './ou-ext.service';

describe('OuExtService', () => {
  let service: OuExtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuExtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
