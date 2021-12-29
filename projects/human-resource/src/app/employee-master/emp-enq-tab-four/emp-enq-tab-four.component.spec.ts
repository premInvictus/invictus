import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqTabFourComponent } from './emp-enq-tab-four.component';

describe('EmpEnqTabFourComponent', () => {
  let component: EmpEnqTabFourComponent;
  let fixture: ComponentFixture<EmpEnqTabFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqTabFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqTabFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
