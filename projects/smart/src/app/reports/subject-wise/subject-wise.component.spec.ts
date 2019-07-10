import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWiseComponent } from './subject-wise.component';

describe('SubjectWiseComponent', () => {
  let component: SubjectWiseComponent;
  let fixture: ComponentFixture<SubjectWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
