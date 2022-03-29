import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRightsReportComponent } from './access-rights-report.component';

describe('AccessRightsReportComponent', () => {
  let component: AccessRightsReportComponent;
  let fixture: ComponentFixture<AccessRightsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRightsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRightsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
