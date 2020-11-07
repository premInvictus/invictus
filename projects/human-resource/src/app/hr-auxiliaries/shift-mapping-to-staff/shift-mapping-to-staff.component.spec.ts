import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftMappingToStaffComponent } from './shift-mapping-to-staff.component';

describe('ShiftMappingToStaffComponent', () => {
  let component: ShiftMappingToStaffComponent;
  let fixture: ComponentFixture<ShiftMappingToStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftMappingToStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftMappingToStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
