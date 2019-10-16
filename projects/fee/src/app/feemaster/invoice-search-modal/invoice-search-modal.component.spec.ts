import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSearchModalComponent } from './invoice-search-modal.component';

describe('InvoiceSearchModalComponent', () => {
  let component: InvoiceSearchModalComponent;
  let fixture: ComponentFixture<InvoiceSearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSearchModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
