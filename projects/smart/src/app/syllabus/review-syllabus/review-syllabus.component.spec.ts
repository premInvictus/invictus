import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSyllabusComponent } from './review-syllabus.component';

describe('ReviewSyllabusComponent', () => {
  let component: ReviewSyllabusComponent;
  let fixture: ComponentFixture<ReviewSyllabusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewSyllabusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
