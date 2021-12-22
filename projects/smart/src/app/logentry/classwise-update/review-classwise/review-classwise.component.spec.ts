import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClasswiseComponent } from './review-classwise.component';

describe('ReviewClasswiseComponent', () => {
  let component: ReviewClasswiseComponent;
  let fixture: ComponentFixture<ReviewClasswiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewClasswiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewClasswiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
