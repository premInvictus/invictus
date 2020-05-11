import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatePrintingComponent } from './certificate-printing.component';

describe('CertificatePrintingComponent', () => {
  let component: CertificatePrintingComponent;
  let fixture: ComponentFixture<CertificatePrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificatePrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificatePrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
