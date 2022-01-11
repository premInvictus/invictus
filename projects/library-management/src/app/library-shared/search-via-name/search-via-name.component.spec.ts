import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchViaNameComponent } from './search-via-name.component';

describe('SearchViaNameComponent', () => {
  let component: SearchViaNameComponent;
  let fixture: ComponentFixture<SearchViaNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchViaNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchViaNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
