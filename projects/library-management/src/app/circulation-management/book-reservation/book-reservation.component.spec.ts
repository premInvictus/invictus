import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReservationComponent } from './book-reservation.component';

describe('BookReservationComponent', () => {
  let component: BookReservationComponent;
  let fixture: ComponentFixture<BookReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
