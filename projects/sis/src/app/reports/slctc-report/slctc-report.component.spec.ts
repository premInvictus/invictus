import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlctcReportComponent } from './slctc-report.component';

describe('SlctcReportComponent', () => {
  let component: SlctcReportComponent;
  let fixture: ComponentFixture<SlctcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlctcReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlctcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
