import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerMessagesComponent } from './reviewer-messages.component';

describe('ReviewerMessagesComponent', () => {
	let component: ReviewerMessagesComponent;
	let fixture: ComponentFixture<ReviewerMessagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ReviewerMessagesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReviewerMessagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
