import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabsComponent } from './slabs.component';

describe('SlabsComponent', () => {
  let component: SlabsComponent;
  let fixture: ComponentFixture<SlabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
