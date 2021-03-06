import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropoutReportComponent } from './drop-out-report.component';

describe('DropoutReportComponent', () => {
  let component: DropoutReportComponent;
  let fixture: ComponentFixture<DropoutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropoutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
