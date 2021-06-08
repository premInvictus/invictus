import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveLocationComponent } from './live-location.component';

describe('LiveLocationComponent', () => {
  let component: LiveLocationComponent;
  let fixture: ComponentFixture<LiveLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
