import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseComponent } from './class-wise.component';

describe('ClassWiseComponent', () => {
  let component: ClassWiseComponent;
  let fixture: ComponentFixture<ClassWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
