import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLogReportsComponent } from './vehicle-log-reports.component';

describe('VehicleLogReportsComponent', () => {
  let component: VehicleLogReportsComponent;
  let fixture: ComponentFixture<VehicleLogReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLogReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLogReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
