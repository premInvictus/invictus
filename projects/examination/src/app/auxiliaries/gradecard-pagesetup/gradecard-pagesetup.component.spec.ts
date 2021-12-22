import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradecardPagesetupComponent } from './gradecard-pagesetup.component';

describe('GradecardPagesetupComponent', () => {
  let component: GradecardPagesetupComponent;
  let fixture: ComponentFixture<GradecardPagesetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradecardPagesetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradecardPagesetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
