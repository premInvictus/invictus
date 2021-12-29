import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqTabFiveComponent } from './emp-enq-tab-five.component';

describe('EmpEnqTabFiveComponent', () => {
  let component: EmpEnqTabFiveComponent;
  let fixture: ComponentFixture<EmpEnqTabFiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqTabFiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqTabFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
