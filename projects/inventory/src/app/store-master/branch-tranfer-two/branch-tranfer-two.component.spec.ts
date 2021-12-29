import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTranferTwoComponent } from './branch-tranfer-two.component';

describe('BranchTranferTwoComponent', () => {
  let component: BranchTranferTwoComponent;
  let fixture: ComponentFixture<BranchTranferTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTranferTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTranferTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
