import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodePrintingComponent } from './barcode-printing.component';

describe('BarcodePrintingComponent', () => {
  let component: BarcodePrintingComponent;
  let fixture: ComponentFixture<BarcodePrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodePrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
