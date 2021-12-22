import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageCumulativeSetupComponent } from './percentage-cumulative-setup.component';

describe('PercentageCumulativeSetupComponent', () => {
  let component: PercentageCumulativeSetupComponent;
  let fixture: ComponentFixture<PercentageCumulativeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageCumulativeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageCumulativeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
