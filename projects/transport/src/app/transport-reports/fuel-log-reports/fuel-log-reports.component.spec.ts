import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelLogReportsComponent } from './fuel-log-reports.component';

describe('FuelLogReportsComponent', () => {
  let component: FuelLogReportsComponent;
  let fixture: ComponentFixture<FuelLogReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelLogReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelLogReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
