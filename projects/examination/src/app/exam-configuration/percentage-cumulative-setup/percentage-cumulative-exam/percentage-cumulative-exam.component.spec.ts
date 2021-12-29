import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageCumulativeExamComponent } from './percentage-cumulative-exam.component';

describe('PercentageCumulativeExamComponent', () => {
  let component: PercentageCumulativeExamComponent;
  let fixture: ComponentFixture<PercentageCumulativeExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageCumulativeExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageCumulativeExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
