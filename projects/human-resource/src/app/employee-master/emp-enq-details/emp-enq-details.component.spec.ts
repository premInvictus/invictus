import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqDetailsComponent } from './emp-enq-details.component';

describe('EmpEnqDetailsComponent', () => {
  let component: EmpEnqDetailsComponent;
  let fixture: ComponentFixture<EmpEnqDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
