import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAssignListComponent } from './store-assign-list.component';

describe('StoreAssignListComponent', () => {
  let component: StoreAssignListComponent;
  let fixture: ComponentFixture<StoreAssignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAssignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
