import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartStopTripComponent } from './start-stop-trip.component';

describe('StartStopTripComponent', () => {
  let component: StartStopTripComponent;
  let fixture: ComponentFixture<StartStopTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartStopTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartStopTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
