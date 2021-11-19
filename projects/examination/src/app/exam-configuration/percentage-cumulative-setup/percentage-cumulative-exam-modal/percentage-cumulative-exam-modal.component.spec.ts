import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageCumulativeExamModalComponent } from './percentage-cumulative-exam-modal.component';

describe('PercentageCumulativeExamModalComponent', () => {
  let component: PercentageCumulativeExamModalComponent;
  let fixture: ComponentFixture<PercentageCumulativeExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageCumulativeExamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageCumulativeExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
