import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRemarksComponent } from './call-remarks.component';

describe('CallRemarksComponent', () => {
  let component: CallRemarksComponent;
  let fixture: ComponentFixture<CallRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
