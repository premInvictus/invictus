import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRightsMultipleComponent } from './assign-rights-multiple.component';

describe('AssignRightsMultipleComponent', () => {
  let component: AssignRightsMultipleComponent;
  let fixture: ComponentFixture<AssignRightsMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignRightsMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRightsMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
