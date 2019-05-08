import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEnrolmentNumberComponent } from './change-enrolment-number.component';

describe('ChangeEnrolmentNumberComponent', () => {
	let component: ChangeEnrolmentNumberComponent;
	let fixture: ComponentFixture<ChangeEnrolmentNumberComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ChangeEnrolmentNumberComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeEnrolmentNumberComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
