import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsThemeTwoComponent } from './student-details-theme-two.component';

describe('StudentDetailsThemeTwoComponent', () => {
	let component: StudentDetailsThemeTwoComponent;
	let fixture: ComponentFixture<StudentDetailsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StudentDetailsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentDetailsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
