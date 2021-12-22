import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingInvoiceComponent } from './missing-invoice.component';

describe('MissingInvoiceComponent', () => {
  let component: MissingInvoiceComponent;
  let fixture: ComponentFixture<MissingInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
