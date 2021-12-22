import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassworkUpdateComponent } from './classwork-update.component';

describe('ClassworkUpdateComponent', () => {
  let component: ClassworkUpdateComponent;
  let fixture: ComponentFixture<ClassworkUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassworkUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassworkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
