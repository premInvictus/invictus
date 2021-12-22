import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqTabOneComponent } from './emp-enq-tab-one.component';

describe('EmpEnqTabOneComponent', () => {
  let component: EmpEnqTabOneComponent;
  let fixture: ComponentFixture<EmpEnqTabOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqTabOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqTabOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
