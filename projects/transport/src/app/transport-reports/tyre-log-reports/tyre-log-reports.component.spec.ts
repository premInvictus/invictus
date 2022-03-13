import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreLogReportsComponent } from './tyre-log-reports.component';

describe('TyreLogReportsComponent', () => {
  let component: TyreLogReportsComponent;
  let fixture: ComponentFixture<TyreLogReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyreLogReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyreLogReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
