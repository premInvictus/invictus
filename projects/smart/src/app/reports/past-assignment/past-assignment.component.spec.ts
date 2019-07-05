import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAssignmentComponent } from './past-assignment.component';

describe('PastAssignmentComponent', () => {
  let component: PastAssignmentComponent;
  let fixture: ComponentFixture<PastAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
