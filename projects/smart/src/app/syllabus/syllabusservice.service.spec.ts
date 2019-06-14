import { TestBed } from '@angular/core/testing';

import { SyllabusserviceService } from './syllabusservice.service';

describe('SyllabusserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyllabusserviceService = TestBed.get(SyllabusserviceService);
    expect(service).toBeTruthy();
  });
});
