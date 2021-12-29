import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEnqTabThreeComponent } from './emp-enq-tab-three.component';

describe('EmpEnqTabThreeComponent', () => {
  let component: EmpEnqTabThreeComponent;
  let fixture: ComponentFixture<EmpEnqTabThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpEnqTabThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpEnqTabThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
