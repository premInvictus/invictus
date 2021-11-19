import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappStaticComponent } from './whatsapp-static.component';

describe('WhatsappStaticComponent', () => {
  let component: WhatsappStaticComponent;
  let fixture: ComponentFixture<WhatsappStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
