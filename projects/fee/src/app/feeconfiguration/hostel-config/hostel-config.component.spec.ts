import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelConfigComponent } from './hostel-config.component';

describe('HostelConfigComponent', () => {
  let component: HostelConfigComponent;
  let fixture: ComponentFixture<HostelConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostelConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
