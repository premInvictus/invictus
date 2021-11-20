import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBulkUpdateSecurityModel } from './app-bulk-update-model.component';

describe('AppBulkUpdateSecurityModel', () => {
  let component: AppBulkUpdateSecurityModel;
  let fixture: ComponentFixture<AppBulkUpdateSecurityModel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBulkUpdateSecurityModel ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBulkUpdateSecurityModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
