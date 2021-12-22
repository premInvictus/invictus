import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLogsTabComponent } from './service-logs-tab.component';

describe('ServiceLogsTabComponent', () => {
  let component: ServiceLogsTabComponent;
  let fixture: ComponentFixture<ServiceLogsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceLogsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLogsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
