import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpCommonProfileComponent } from './emp-common-profile.component';

describe('EmpCommonProfileComponent', () => {
  let component: EmpCommonProfileComponent;
  let fixture: ComponentFixture<EmpCommonProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpCommonProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpCommonProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
