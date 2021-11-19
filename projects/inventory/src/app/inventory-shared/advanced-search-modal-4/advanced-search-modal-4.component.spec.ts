import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchModalComponentFour } from './advanced-search-modal-4.component';

describe('AdvancedSearchModalComponentFour', () => {
  let component: AdvancedSearchModalComponentFour;
  let fixture: ComponentFixture<AdvancedSearchModalComponentFour>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchModalComponentFour ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchModalComponentFour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
