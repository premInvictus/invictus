import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSyllabusComponent } from './browse-syllabus.component';

describe('BrowseSyllabusComponent', () => {
  let component: BrowseSyllabusComponent;
  let fixture: ComponentFixture<BrowseSyllabusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseSyllabusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
