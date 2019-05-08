import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSlctcComponent } from './request-slctc.component';

describe('RequestSlctcComponent', () => {
	let component: RequestSlctcComponent;
	let fixture: ComponentFixture<RequestSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RequestSlctcComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RequestSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
