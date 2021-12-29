import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqTabTwoComponent } from './emp-enq-tab-two.component';

describe('EmpEnqTabTwoComponent', () => {
  let component: EmpEnqTabTwoComponent;
  let fixture: ComponentFixture<EmpEnqTabTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqTabTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqTabTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
