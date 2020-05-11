import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMappingComponent } from './fa-position-mapping.component';

describe('PositionMappingComponent', () => {
  let component: PositionMappingComponent;
  let fixture: ComponentFixture<PositionMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
