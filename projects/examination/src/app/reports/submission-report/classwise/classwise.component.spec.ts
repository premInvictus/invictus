import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseComponent } from './classwise.component';

describe('ClasswiseComponent', () => {
  let component: ClasswiseComponent;
  let fixture: ComponentFixture<ClasswiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasswiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
