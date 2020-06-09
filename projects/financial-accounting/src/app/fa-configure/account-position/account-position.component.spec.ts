import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPositionComponent } from './account-position.component';

describe('AccountPositionComponent', () => {
  let component: AccountPositionComponent;
  let fixture: ComponentFixture<AccountPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
