import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessUserComponent } from './manage-access-user.component';

describe('ManageAccessUserComponent', () => {
  let component: ManageAccessUserComponent;
  let fixture: ComponentFixture<ManageAccessUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccessUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
