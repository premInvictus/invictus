import { TestBed } from '@angular/core/testing';

import { TransportusertypeService } from './transportusertype.service';

describe('HrusertypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransportusertypeService = TestBed.get(TransportusertypeService);
    expect(service).toBeTruthy();
  });
});
