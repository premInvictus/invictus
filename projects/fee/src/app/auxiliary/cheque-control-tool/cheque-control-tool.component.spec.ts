import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeControlToolComponent } from './cheque-control-tool.component';

describe('ChequeControlToolComponent', () => {
  let component: ChequeControlToolComponent;
  let fixture: ComponentFixture<ChequeControlToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeControlToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeControlToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
