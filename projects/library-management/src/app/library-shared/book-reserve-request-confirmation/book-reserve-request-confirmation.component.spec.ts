import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReserveRequestConfirmationComponent } from './book-reserve-request-confirmation.component';

describe('BookReserveRequestConfirmationComponent', () => {
  let component: BookReserveRequestConfirmationComponent;
  let fixture: ComponentFixture<BookReserveRequestConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookReserveRequestConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReserveRequestConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
