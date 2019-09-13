import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollnoAllotmentComponent } from './rollno-allotment.component';

describe('RollnoAllotmentComponent', () => {
  let component: RollnoAllotmentComponent;
  let fixture: ComponentFixture<RollnoAllotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollnoAllotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollnoAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
