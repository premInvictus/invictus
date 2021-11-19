import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetModalComponent } from './balance-sheet-modal.component';

describe('BalanceSheetModalComponent', () => {
  let component: BalanceSheetModalComponent;
  let fixture: ComponentFixture<BalanceSheetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSheetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
