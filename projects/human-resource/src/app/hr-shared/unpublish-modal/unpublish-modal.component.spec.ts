import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishModalComponent } from './unpublish-modal.component';

describe('UnpublishModalComponent', () => {
  let component: UnpublishModalComponent;
  let fixture: ComponentFixture<UnpublishModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpublishModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
