import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockaccessesComponent } from './blockaccesses.component';

describe('BlockaccessesComponent', () => {
  let component: BlockaccessesComponent;
  let fixture: ComponentFixture<BlockaccessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockaccessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockaccessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
