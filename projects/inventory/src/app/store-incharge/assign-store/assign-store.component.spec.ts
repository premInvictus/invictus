import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStoreComponent } from './assign-store.component';

describe('AssignStoreComponent', () => {
  let component: AssignStoreComponent;
  let fixture: ComponentFixture<AssignStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
