import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOnlineSessionComponent } from './edit-online-session.component';

describe('EditOnlineSessionComponent', () => {
  let component: EditOnlineSessionComponent;
  let fixture: ComponentFixture<EditOnlineSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOnlineSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOnlineSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
