import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedFeetransReportComponent } from './deleted-feetrans-report.component';

describe('DeletedFeetransReportComponent', () => {
  let component: DeletedFeetransReportComponent;
  let fixture: ComponentFixture<DeletedFeetransReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedFeetransReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedFeetransReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
