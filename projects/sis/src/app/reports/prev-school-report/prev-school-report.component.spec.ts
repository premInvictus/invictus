import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevSchoolReportComponent } from './prev-school-report.component';

describe('PrevSchoolReportComponent', () => {
  let component: PrevSchoolReportComponent;
  let fixture: ComponentFixture<PrevSchoolReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevSchoolReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevSchoolReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
