import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReconciliationComponent } from './stock-reconciliation.component';

describe('StockReconciliationComponent', () => {
  let component: StockReconciliationComponent;
  let fixture: ComponentFixture<StockReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
