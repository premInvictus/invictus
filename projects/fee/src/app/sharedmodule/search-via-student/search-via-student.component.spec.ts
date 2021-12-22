import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchViaStudentComponent } from './search-via-student.component';

describe('SearchViaStudentComponent', () => {
  let component: SearchViaStudentComponent;
  let fixture: ComponentFixture<SearchViaStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchViaStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchViaStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
