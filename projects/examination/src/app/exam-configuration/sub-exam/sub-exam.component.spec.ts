import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubExamComponent } from './sub-exam.component';

describe('SubExamComponent', () => {
  let component: SubExamComponent;
  let fixture: ComponentFixture<SubExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
