import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCodeGenerationComponent } from './item-code-generation.component';

describe('ItemCodeGenerationComponent', () => {
  let component: ItemCodeGenerationComponent;
  let fixture: ComponentFixture<ItemCodeGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCodeGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCodeGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
