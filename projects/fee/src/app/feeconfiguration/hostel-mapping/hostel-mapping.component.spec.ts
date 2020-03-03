import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelMappingComponent } from './hostel-mapping.component';

describe('HostelMappingComponent', () => {
  let component: HostelMappingComponent;
  let fixture: ComponentFixture<HostelMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostelMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
