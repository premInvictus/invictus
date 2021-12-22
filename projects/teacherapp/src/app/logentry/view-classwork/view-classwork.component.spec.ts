import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClassworkComponent } from './view-classwork.component';

describe('ViewClassworkComponent', () => {
  let component: ViewClassworkComponent;
  let fixture: ComponentFixture<ViewClassworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClassworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClassworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
