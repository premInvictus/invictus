import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDepositComponent } from './security-deposit.component';

describe('SecurityDepositComponent', () => {
  let component: SecurityDepositComponent;
  let fixture: ComponentFixture<SecurityDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
