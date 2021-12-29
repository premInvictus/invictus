import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDetailSaleReportComponent } from './store-detail-sale-report.component';

describe('StoreDetailSaleReportComponent', () => {
  let component: StoreDetailSaleReportComponent;
  let fixture: ComponentFixture<StoreDetailSaleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreDetailSaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDetailSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
