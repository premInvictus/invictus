import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillOfComponent } from './generate-bill-of.component';

describe('GenerateBillOfComponent', () => {
  let component: GenerateBillOfComponent;
  let fixture: ComponentFixture<GenerateBillOfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateBillOfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
