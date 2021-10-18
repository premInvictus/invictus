import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchModalComponentTwo } from './advanced-search-modal-2.component';

describe('AdvancedSearchModalComponentTwo', () => {
  let component: AdvancedSearchModalComponentTwo;
  let fixture: ComponentFixture<AdvancedSearchModalComponentTwo>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchModalComponentTwo ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchModalComponentTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
