import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessionMasterComponent } from './accession-master.component';

describe('AccessionMasterComponent', () => {
  let component: AccessionMasterComponent;
  let fixture: ComponentFixture<AccessionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
