import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSearchAndAddComponent } from './location-search-and-add.component';

describe('LocationSearchAndAddComponent', () => {
  let component: LocationSearchAndAddComponent;
  let fixture: ComponentFixture<LocationSearchAndAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSearchAndAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchAndAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
