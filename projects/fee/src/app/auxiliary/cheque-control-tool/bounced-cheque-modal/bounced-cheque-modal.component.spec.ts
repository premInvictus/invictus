import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncedChequeModalComponent } from './bounced-cheque-modal.component';

describe('BouncedChequeModalComponent', () => {
  let component: BouncedChequeModalComponent;
  let fixture: ComponentFixture<BouncedChequeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncedChequeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncedChequeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
