import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectwiseScoreCardComponent } from './subjectwise-score-card.component';

describe('SubjectwiseScoreCardComponent', () => {
  let component: SubjectwiseScoreCardComponent;
  let fixture: ComponentFixture<SubjectwiseScoreCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectwiseScoreCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectwiseScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
