import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirculationConsumptionComponent } from './circulation-consumption.component';

describe('CirculationConsumptionComponent', () => {
  let component: CirculationConsumptionComponent;
  let fixture: ComponentFixture<CirculationConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirculationConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirculationConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
