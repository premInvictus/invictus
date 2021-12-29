import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerEntryModelComponent } from './ledger-entry-model.component';

describe('LedgerEntryModelComponent', () => {
  let component: LedgerEntryModelComponent;
  let fixture: ComponentFixture<LedgerEntryModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerEntryModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerEntryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
