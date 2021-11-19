import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAssignReportComponent } from './store-assign-report.component';

describe('StoreAssignReportComponent', () => {
  let component: StoreAssignReportComponent;
  let fixture: ComponentFixture<StoreAssignReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAssignReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAssignReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
