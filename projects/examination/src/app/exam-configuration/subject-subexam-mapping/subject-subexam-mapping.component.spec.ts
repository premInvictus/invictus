import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSubexamMappingComponent } from './subject-subexam-mapping.component';

describe('SubjectSubexamMappingComponent', () => {
  let component: SubjectSubexamMappingComponent;
  let fixture: ComponentFixture<SubjectSubexamMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSubexamMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSubexamMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
