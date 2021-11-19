import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInfoUploadComponent } from './system-info-upload.component';

describe('SystemInfoUploadComponent', () => {
  let component: SystemInfoUploadComponent;
  let fixture: ComponentFixture<SystemInfoUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemInfoUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemInfoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
