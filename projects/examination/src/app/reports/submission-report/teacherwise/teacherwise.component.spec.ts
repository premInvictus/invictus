import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherwiseComponent } from './teacherwise.component';

describe('TeacherwiseComponent', () => {
  let component: TeacherwiseComponent;
  let fixture: ComponentFixture<TeacherwiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
