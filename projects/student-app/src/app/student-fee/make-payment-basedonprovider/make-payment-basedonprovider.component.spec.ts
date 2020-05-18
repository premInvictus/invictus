import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentBasedonproviderComponent } from './make-payment-basedonprovider.component';

describe('MakePaymentBasedonproviderComponent', () => {
  let component: MakePaymentBasedonproviderComponent;
  let fixture: ComponentFixture<MakePaymentBasedonproviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentBasedonproviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentBasedonproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
