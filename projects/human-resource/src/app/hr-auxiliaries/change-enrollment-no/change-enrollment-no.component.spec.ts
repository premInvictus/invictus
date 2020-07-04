import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEnrollmentNoComponent } from './change-enrollment-no.component';

describe('ChangeEnrollmentNoComponent', () => {
  let component: ChangeEnrollmentNoComponent;
  let fixture: ComponentFixture<ChangeEnrollmentNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeEnrollmentNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEnrollmentNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
