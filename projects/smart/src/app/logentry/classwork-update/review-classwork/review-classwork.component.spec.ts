import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClassworkComponent } from './review-classwork.component';

describe('ReviewClassworkComponent', () => {
  let component: ReviewClassworkComponent;
  let fixture: ComponentFixture<ReviewClassworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewClassworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewClassworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
