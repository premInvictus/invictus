import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyWiseAccountsComponent } from './party-wise-accounts.component';

describe('PartyWiseAccountsComponent', () => {
  let component: PartyWiseAccountsComponent;
  let fixture: ComponentFixture<PartyWiseAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyWiseAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyWiseAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
