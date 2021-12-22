import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativeLongListComponent } from './comparative-long-list.component';

describe('ComparativeLongListComponent', () => {
  let component: ComparativeLongListComponent;
  let fixture: ComponentFixture<ComparativeLongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparativeLongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativeLongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
