import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMapComponent } from './class-map.component';

describe('ClassMapComponent', () => {
  let component: ClassMapComponent;
  let fixture: ComponentFixture<ClassMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
