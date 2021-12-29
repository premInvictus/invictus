import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsModalComponent } from './book-details-modal.component';

describe('BookDetailsModalComponent', () => {
  let component: BookDetailsModalComponent;
  let fixture: ComponentFixture<BookDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
