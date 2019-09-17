import { TestBed } from '@angular/core/testing';

import { StudentRouteMoveStoreService } from './student-route-move-store.service';

describe('StudentRouteMoveStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentRouteMoveStoreService = TestBed.get(StudentRouteMoveStoreService);
    expect(service).toBeTruthy();
  });
});
