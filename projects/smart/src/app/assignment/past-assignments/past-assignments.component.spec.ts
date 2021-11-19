import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAssignmentsComponent } from './past-assignments.component';

describe('PastAssignmentsComponent', () => {
  let component: PastAssignmentsComponent;
  let fixture: ComponentFixture<PastAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
