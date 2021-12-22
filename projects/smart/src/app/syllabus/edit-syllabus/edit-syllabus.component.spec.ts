import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSyllabusComponent } from './edit-syllabus.component';

describe('EditSyllabusComponent', () => {
  let component: EditSyllabusComponent;
  let fixture: ComponentFixture<EditSyllabusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSyllabusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
