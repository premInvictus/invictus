import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAssessmentsComponent } from './record-assessments.component';

describe('RecordAssessmentsComponent', () => {
  let component: RecordAssessmentsComponent;
  let fixture: ComponentFixture<RecordAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
