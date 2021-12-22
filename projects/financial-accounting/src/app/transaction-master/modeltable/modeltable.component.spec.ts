import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeltableComponent } from './modeltable.component';

describe('ModeltableComponent', () => {
  let component: ModeltableComponent;
  let fixture: ComponentFixture<ModeltableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeltableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeltableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
