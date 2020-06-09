import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalFeeReceivableComponent } from './total-fee-receivable.component';

describe('TotalFeeReceivableComponent', () => {
  let component: TotalFeeReceivableComponent;
  let fixture: ComponentFixture<TotalFeeReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalFeeReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalFeeReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
