import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicMapComponent } from './subtopic-map.component';

describe('SubtopicMapComponent', () => {
  let component: SubtopicMapComponent;
  let fixture: ComponentFixture<SubtopicMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtopicMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
