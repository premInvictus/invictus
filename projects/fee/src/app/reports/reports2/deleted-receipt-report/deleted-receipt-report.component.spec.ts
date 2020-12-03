import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedReceiptReportComponent } from './deleted-receipt-report.component';

describe('DeletedReceiptReportComponent', () => {
  let component: DeletedReceiptReportComponent;
  let fixture: ComponentFixture<DeletedReceiptReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedReceiptReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedReceiptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
