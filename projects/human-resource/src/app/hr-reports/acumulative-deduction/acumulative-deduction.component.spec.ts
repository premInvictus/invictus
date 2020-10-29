import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumulativeDeductionComponent } from './acumulative-deduction.component';

describe('AcumulativeDeductionComponent', () => {
  let component: AcumulativeDeductionComponent;
  let fixture: ComponentFixture<AcumulativeDeductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcumulativeDeductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcumulativeDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
