import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalVerificationComponent } from './physical-verification.component';

describe('PhysicalVerificationComponent', () => {
  let component: PhysicalVerificationComponent;
  let fixture: ComponentFixture<PhysicalVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
