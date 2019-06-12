import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusManagementComponent } from './syllabus-management.component';

describe('SyllabusManagementComponent', () => {
  let component: SyllabusManagementComponent;
  let fixture: ComponentFixture<SyllabusManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyllabusManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
