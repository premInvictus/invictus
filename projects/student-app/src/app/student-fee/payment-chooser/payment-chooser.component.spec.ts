import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChooserComponent } from './payment-chooser.component';

describe('PaymentChooserComponent', () => {
  let component: PaymentChooserComponent;
  let fixture: ComponentFixture<PaymentChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
