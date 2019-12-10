import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementMasterComponent } from './procurement-master.component';

describe('ProcurementMasterComponent', () => {
  let component: ProcurementMasterComponent;
  let fixture: ComponentFixture<ProcurementMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
