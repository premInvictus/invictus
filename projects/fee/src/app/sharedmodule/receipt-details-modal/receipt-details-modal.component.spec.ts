import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDetailsModalComponent } from './receipt-details-modal.component';

describe('ReceiptDetailsModalComponent', () => {
  let component: ReceiptDetailsModalComponent;
  let fixture: ComponentFixture<ReceiptDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
