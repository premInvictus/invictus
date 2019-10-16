import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverDueBookReportComponent } from './over-due-book-report.component';

describe('OverDueBookReportComponent', () => {
  let component: OverDueBookReportComponent;
  let fixture: ComponentFixture<OverDueBookReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverDueBookReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverDueBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
