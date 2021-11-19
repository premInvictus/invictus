import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseTimetableComponent } from './class-wise-timetable.component';

describe('ClassWiseTimetableComponent', () => {
  let component: ClassWiseTimetableComponent;
  let fixture: ComponentFixture<ClassWiseTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassWiseTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassWiseTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
