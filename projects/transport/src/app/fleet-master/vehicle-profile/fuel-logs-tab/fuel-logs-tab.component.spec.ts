import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelLogsTabComponent } from './fuel-logs-tab.component';

describe('FuelLogsTabComponent', () => {
  let component: FuelLogsTabComponent;
  let fixture: ComponentFixture<FuelLogsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelLogsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
