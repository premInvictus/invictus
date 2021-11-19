import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSubjectComponent } from './additional-subject.component';

describe('AdditionalSubjectComponent', () => {
  let component: AdditionalSubjectComponent;
  let fixture: ComponentFixture<AdditionalSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
