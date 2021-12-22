import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolLedgerComponent } from './school-ledger.component';

describe('SchoolLedgerComponent', () => {
  let component: SchoolLedgerComponent;
  let fixture: ComponentFixture<SchoolLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
