import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLogReportsComponent } from './service-log-reports.component';

describe('ServiceLogReportsComponent', () => {
  let component: ServiceLogReportsComponent;
  let fixture: ComponentFixture<ServiceLogReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceLogReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLogReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
