import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPaperDialogComponent } from './question-paper-dialog.component';

describe('QuestionPaperDialogComponent', () => {
  let component: QuestionPaperDialogComponent;
  let fixture: ComponentFixture<QuestionPaperDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPaperDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPaperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
