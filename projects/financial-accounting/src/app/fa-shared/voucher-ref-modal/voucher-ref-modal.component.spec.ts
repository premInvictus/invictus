import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRefModalComponent } from './voucher-ref-modal.component';

describe('VoucherRefModalComponent', () => {
  let component: VoucherRefModalComponent;
  let fixture: ComponentFixture<VoucherRefModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherRefModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRefModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
