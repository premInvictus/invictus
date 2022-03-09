import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedTimetableComponent } from './combined-timetable.component';

describe('CombinedTimetableComponent', () => {
  let component: CombinedTimetableComponent;
  let fixture: ComponentFixture<CombinedTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
