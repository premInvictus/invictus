import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWiseComponent } from './teacher-wise.component';

describe('TeacherWiseComponent', () => {
  let component: TeacherWiseComponent;
  let fixture: ComponentFixture<TeacherWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
