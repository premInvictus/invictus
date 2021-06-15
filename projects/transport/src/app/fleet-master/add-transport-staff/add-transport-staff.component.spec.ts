import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransportStaffComponent } from './add-transport-staff.component';

describe('AddTransportStaffComponent', () => {
  let component: AddTransportStaffComponent;
  let fixture: ComponentFixture<AddTransportStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransportStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransportStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
