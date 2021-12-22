import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCorrectionComponent } from './report-correction.component';

describe('ReportCorrectionComponent', () => {
  let component: ReportCorrectionComponent;
  let fixture: ComponentFixture<ReportCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
