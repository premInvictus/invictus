import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaggedBooksComponent } from './flagged-books.component';

describe('FlaggedBooksComponent', () => {
  let component: FlaggedBooksComponent;
  let fixture: ComponentFixture<FlaggedBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlaggedBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlaggedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
