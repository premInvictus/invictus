import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountWiseComponent } from './account-wise.component';

describe('AccountWiseComponent', () => {
  let component: AccountWiseComponent;
  let fixture: ComponentFixture<AccountWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
