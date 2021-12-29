import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownCertificateComponent } from './down-certificate.component';

describe('DownCertificateComponent', () => {
  let component: DownCertificateComponent;
  let fixture: ComponentFixture<DownCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
