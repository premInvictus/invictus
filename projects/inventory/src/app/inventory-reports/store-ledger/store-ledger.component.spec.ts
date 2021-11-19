import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreLedgerComponent } from './store-ledger.component';

describe('StoreLedgerComponent', () => {
  let component: StoreLedgerComponent;
  let fixture: ComponentFixture<StoreLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
