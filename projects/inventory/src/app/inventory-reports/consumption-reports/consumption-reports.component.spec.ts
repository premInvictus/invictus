import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionReportsComponent } from './consumption-reports.component';

describe('ConsumptionReportsComponent', () => {
  let component: ConsumptionReportsComponent;
  let fixture: ComponentFixture<ConsumptionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
