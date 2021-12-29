import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleclassesComponent } from './scheduleclasses.component';

describe('ScheduleclassesComponent', () => {
  let component: ScheduleclassesComponent;
  let fixture: ComponentFixture<ScheduleclassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleclassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleclassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
