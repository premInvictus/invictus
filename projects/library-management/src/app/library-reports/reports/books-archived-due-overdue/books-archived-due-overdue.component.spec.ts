import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksArchivedDueOverdueComponent } from './books-archived-due-overdue.component';

describe('BooksArchivedDueOverdueComponent', () => {
  let component: BooksArchivedDueOverdueComponent;
  let fixture: ComponentFixture<BooksArchivedDueOverdueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksArchivedDueOverdueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksArchivedDueOverdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
