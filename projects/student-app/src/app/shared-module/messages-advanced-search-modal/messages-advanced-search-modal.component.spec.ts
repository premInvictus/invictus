import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesAdvancedSearchModalComponent } from './messages-advanced-search-modal.component';

describe('MessagesAdvancedSearchModalComponent', () => {
  let component: MessagesAdvancedSearchModalComponent;
  let fixture: ComponentFixture<MessagesAdvancedSearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesAdvancedSearchModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesAdvancedSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
