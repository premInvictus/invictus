import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsDeliverStatusComponent } from './sms-deliver-status.component';

describe('SmsDeliverStatusComponent', () => {
  let component: SmsDeliverStatusComponent;
  let fixture: ComponentFixture<SmsDeliverStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsDeliverStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsDeliverStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
