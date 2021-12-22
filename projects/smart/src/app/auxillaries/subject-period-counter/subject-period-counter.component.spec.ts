import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPeriodCounterComponent } from './subject-period-counter.component';

describe('SubjectPeriodCounterComponent', () => {
  let component: SubjectPeriodCounterComponent;
  let fixture: ComponentFixture<SubjectPeriodCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectPeriodCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPeriodCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
