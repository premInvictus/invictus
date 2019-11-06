import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodeReportComponent } from './bar-code-report.component';

describe('BarCodeReportComponent', () => {
  let component: BarCodeReportComponent;
  let fixture: ComponentFixture<BarCodeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarCodeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
