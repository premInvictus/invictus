import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncedChequeMultipleComponent } from './bounced-cheque-multiple.component';

describe('BouncedChequeMultipleComponent', () => {
  let component: BouncedChequeMultipleComponent;
  let fixture: ComponentFixture<BouncedChequeMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncedChequeMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncedChequeMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
