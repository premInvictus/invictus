import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbseMarksAnalysisComponent } from './cbse-marks-analysis.component';

describe('CbseMarksAnalysisComponent', () => {
  let component: CbseMarksAnalysisComponent;
  let fixture: ComponentFixture<CbseMarksAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbseMarksAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbseMarksAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
