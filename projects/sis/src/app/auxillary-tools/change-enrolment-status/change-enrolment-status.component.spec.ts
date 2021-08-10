import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEnrolmentStatusComponent } from './change-enrolment-status.component';

describe('ChangeEnrolmentStatusComponent', () => {
	let component: ChangeEnrolmentStatusComponent;
	let fixture: ComponentFixture<ChangeEnrolmentStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ChangeEnrolmentStatusComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeEnrolmentStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
