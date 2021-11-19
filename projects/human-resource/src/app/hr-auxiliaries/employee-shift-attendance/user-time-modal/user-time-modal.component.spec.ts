import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimeModalComponent } from './user-time-modal.component';

describe('UserTimeModalComponent', () => {
  let component: UserTimeModalComponent;
  let fixture: ComponentFixture<UserTimeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTimeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
