import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidPrintingComponent } from './rfid-printing.component';

describe('RfidPrintingComponent', () => {
  let component: RfidPrintingComponent;
  let fixture: ComponentFixture<RfidPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfidPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
