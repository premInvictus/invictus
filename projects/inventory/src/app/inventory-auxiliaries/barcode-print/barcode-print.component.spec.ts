import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodePrintComponent } from './barcode-print.component';

describe('BarcodePrintComponent', () => {
  let component: BarcodePrintComponent;
  let fixture: ComponentFixture<BarcodePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
