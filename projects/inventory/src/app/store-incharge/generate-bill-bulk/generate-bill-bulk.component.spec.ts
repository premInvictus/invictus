import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillBulkComponent } from './generate-bill-bulk.component';

describe('GenerateBillBulkComponent', () => {
  let component: GenerateBillBulkComponent;
  let fixture: ComponentFixture<GenerateBillBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateBillBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
