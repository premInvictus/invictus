import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLogItemsComponent } from './service-log-items.component';

describe('ServiceLogItemsComponent', () => {
  let component: ServiceLogItemsComponent;
  let fixture: ComponentFixture<ServiceLogItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceLogItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLogItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
