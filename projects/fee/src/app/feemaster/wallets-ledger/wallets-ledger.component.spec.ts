import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsLedgerComponent } from './wallets-ledger.component';

describe('WalletsLedgerComponent', () => {
  let component: WalletsLedgerComponent;
  let fixture: ComponentFixture<WalletsLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletsLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletsLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
