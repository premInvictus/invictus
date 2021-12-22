import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappDynamicComponent } from './whatsapp-dynamic.component';

describe('WhatsappDynamicComponent', () => {
  let component: WhatsappDynamicComponent;
  let fixture: ComponentFixture<WhatsappDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
