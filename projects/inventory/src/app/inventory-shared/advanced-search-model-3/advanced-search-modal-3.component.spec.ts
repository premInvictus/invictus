import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchModalComponentThree } from './advanced-search-modal-3.component';

describe('AdvancedSearchModalComponentThree', () => {
  let component: AdvancedSearchModalComponentThree;
  let fixture: ComponentFixture<AdvancedSearchModalComponentThree>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchModalComponentThree ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchModalComponentThree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
