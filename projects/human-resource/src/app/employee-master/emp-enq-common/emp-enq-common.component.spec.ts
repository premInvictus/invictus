import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqCommonComponent } from './emp-enq-common.component';

describe('EmpEnqCommonComponent', () => {
  let component: EmpEnqCommonComponent;
  let fixture: ComponentFixture<EmpEnqCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
