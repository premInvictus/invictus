import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptModeWiseComponent } from './receipt-mode-wise.component';

describe('ReceiptModeWiseComponent', () => {
  let component: ReceiptModeWiseComponent;
  let fixture: ComponentFixture<ReceiptModeWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptModeWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptModeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
