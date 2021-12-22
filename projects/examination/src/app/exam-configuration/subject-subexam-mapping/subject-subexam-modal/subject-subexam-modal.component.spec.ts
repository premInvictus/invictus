import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSubexamModalComponent } from './subject-subexam-modal.component';

describe('SubjectSubexamModalComponent', () => {
  let component: SubjectSubexamModalComponent;
  let fixture: ComponentFixture<SubjectSubexamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSubexamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSubexamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
