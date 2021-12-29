import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasswiseUpdateComponent } from './classwise-update.component';

describe('ClasswiseUpdateComponent', () => {
  let component: ClasswiseUpdateComponent;
  let fixture: ComponentFixture<ClasswiseUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasswiseUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasswiseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
