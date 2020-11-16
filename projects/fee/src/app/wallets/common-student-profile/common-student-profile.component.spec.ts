import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonStudentProfileComponent } from './common-student-profile.component';

describe('CommonStudentProfileComponent', () => {
	let component: CommonStudentProfileComponent;
	let fixture: ComponentFixture<CommonStudentProfileComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CommonStudentProfileComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommonStudentProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
