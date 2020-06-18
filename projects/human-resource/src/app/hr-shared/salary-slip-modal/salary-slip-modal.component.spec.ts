import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySlipModalComponent } from './salary-slip-modal.component';

describe('SalarySlipModalComponent', () => {
  let component: SalarySlipModalComponent;
  let fixture: ComponentFixture<SalarySlipModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySlipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySlipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
