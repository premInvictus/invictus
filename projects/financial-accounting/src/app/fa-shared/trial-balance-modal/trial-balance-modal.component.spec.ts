import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialBalanceModalComponent } from './trial-balance-modal.component';

describe('TrialBalanceModalComponent', () => {
  let component: TrialBalanceModalComponent;
  let fixture: ComponentFixture<TrialBalanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialBalanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialBalanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
