import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpuslishExamComponent } from './unpuslish-exam.component';

describe('UnpuslishExamComponent', () => {
  let component: UnpuslishExamComponent;
  let fixture: ComponentFixture<UnpuslishExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpuslishExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpuslishExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
