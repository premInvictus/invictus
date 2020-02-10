import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogRemarksModalComponent } from './call-log-remarks-modal.component';

describe('CallLogRemarksModalComponent', () => {
  let component: CallLogRemarksModalComponent;
  let fixture: ComponentFixture<CallLogRemarksModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallLogRemarksModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallLogRemarksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
