import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksRegisterComponent } from './marks-register.component';

describe('MarksRegisterComponent', () => {
  let component: MarksRegisterComponent;
  let fixture: ComponentFixture<MarksRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
