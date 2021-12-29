import { TestBed } from '@angular/core/testing';

import { SmartusertypeService } from './smartusertype.service';

describe('SmartusertypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartusertypeService = TestBed.get(SmartusertypeService);
    expect(service).toBeTruthy();
  });
});
