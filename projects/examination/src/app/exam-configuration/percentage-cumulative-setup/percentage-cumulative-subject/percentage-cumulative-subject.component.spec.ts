import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageCumulativeSubjectComponent } from './percentage-cumulative-subject.component';

describe('PercentageCumulativeSubjectComponent', () => {
  let component: PercentageCumulativeSubjectComponent;
  let fixture: ComponentFixture<PercentageCumulativeSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageCumulativeSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageCumulativeSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
