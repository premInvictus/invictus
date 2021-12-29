import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailsModalComponent } from './invoice-details-modal.component';

describe('InvoiceDetailsModalComponent', () => {
  let component: InvoiceDetailsModalComponent;
  let fixture: ComponentFixture<InvoiceDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
