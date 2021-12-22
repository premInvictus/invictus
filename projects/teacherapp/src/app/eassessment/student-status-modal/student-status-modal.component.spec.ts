import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStatusModalComponent } from './student-status-modal.component';

describe('StudentStatusModalComponent', () => {
  let component: StudentStatusModalComponent;
  let fixture: ComponentFixture<StudentStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
