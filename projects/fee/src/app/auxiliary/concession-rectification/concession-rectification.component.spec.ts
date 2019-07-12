import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionRectificationComponent } from './concession-rectification.component';

describe('ConcessionRectificationComponent', () => {
  let component: ConcessionRectificationComponent;
  let fixture: ComponentFixture<ConcessionRectificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcessionRectificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionRectificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
