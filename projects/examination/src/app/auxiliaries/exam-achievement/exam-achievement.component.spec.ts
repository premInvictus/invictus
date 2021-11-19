import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAchievementComponent } from './exam-achievement.component';

describe('ExamAchievementComponent', () => {
  let component: ExamAchievementComponent;
  let fixture: ComponentFixture<ExamAchievementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamAchievementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
