import { TestBed } from '@angular/core/testing';

import { HrusertypeService } from './hrusertype.service';

describe('HrusertypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HrusertypeService = TestBed.get(HrusertypeService);
    expect(service).toBeTruthy();
  });
});
