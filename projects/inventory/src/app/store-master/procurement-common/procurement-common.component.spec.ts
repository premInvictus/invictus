import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementCommonComponent } from './procurement-common.component';

describe('ProcurementCommonComponent', () => {
  let component: ProcurementCommonComponent;
  let fixture: ComponentFixture<ProcurementCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
