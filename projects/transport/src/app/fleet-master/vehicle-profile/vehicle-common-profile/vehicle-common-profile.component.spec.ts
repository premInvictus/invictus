import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCommonProfileComponent } from './vehicle-common-profile.component';

describe('VehicleCommonProfileComponent', () => {
  let component: VehicleCommonProfileComponent;
  let fixture: ComponentFixture<VehicleCommonProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCommonProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCommonProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
