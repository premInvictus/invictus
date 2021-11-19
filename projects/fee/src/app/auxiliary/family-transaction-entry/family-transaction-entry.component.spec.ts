import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTransactionEntryComponent } from './family-transaction-entry.component';

describe('FamilyTransactionEntryComponent', () => {
  let component: FamilyTransactionEntryComponent;
  let fixture: ComponentFixture<FamilyTransactionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyTransactionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTransactionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
