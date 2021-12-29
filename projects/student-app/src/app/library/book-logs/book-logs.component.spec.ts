import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLogsComponent } from './book-logs.component';

describe('BookLogsComponent', () => {
  let component: BookLogsComponent;
  let fixture: ComponentFixture<BookLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
