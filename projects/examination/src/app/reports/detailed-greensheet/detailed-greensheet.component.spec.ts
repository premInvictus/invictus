import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedGreenSheetComponent } from './detailed-greensheet.component';

describe('DetailedGreenSheetComponent', () => {
  let component: DetailedGreenSheetComponent;
  let fixture: ComponentFixture<DetailedGreenSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedGreenSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedGreenSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
