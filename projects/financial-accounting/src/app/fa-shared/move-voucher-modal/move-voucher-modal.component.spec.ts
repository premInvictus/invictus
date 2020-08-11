import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveVoucherModalComponent } from './move-voucher-modal.component';

describe('MoveVoucherModalComponent', () => {
  let component: MoveVoucherModalComponent;
  let fixture: ComponentFixture<MoveVoucherModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveVoucherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveVoucherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
