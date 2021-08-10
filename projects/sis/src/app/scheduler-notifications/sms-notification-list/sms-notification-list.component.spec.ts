import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsNotificationListComponent } from './sms-notification-list.component';

describe('SmsNotificationListComponent', () => {
	let component: SmsNotificationListComponent;
	let fixture: ComponentFixture<SmsNotificationListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SmsNotificationListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SmsNotificationListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
