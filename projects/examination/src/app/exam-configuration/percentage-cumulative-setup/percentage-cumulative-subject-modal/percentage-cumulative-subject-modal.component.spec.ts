import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageCumulativeSubjectModalComponent } from './percentage-cumulative-subject-modal.component';

describe('PercentageCumulativeSubjectModalComponent', () => {
  let component: PercentageCumulativeSubjectModalComponent;
  let fixture: ComponentFixture<PercentageCumulativeSubjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageCumulativeSubjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageCumulativeSubjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
