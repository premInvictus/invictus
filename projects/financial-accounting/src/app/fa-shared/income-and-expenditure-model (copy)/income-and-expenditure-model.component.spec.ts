import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeAndExpenditureModalComponent } from './income-and-expenditure-model.component';

describe('IncomeAndExpenditureModalComponent', () => {
  let component: IncomeAndExpenditureModalComponent;
  let fixture: ComponentFixture<IncomeAndExpenditureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeAndExpenditureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeAndExpenditureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
