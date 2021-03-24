import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCollectionReportComponent } from './store-collection-report.component';

describe('StoreCollectionReportComponent', () => {
  let component: StoreCollectionReportComponent;
  let fixture: ComponentFixture<StoreCollectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCollectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
