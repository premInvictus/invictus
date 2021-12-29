import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsMapComponent } from './subjects-map.component';

describe('SubjectsMapComponent', () => {
  let component: SubjectsMapComponent;
  let fixture: ComponentFixture<SubjectsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
