import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentStrengthComponent } from './student-strength.component';

describe('StudentStrengthComponent', () => {
	let component: StudentStrengthComponent;
	let fixture: ComponentFixture<StudentStrengthComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StudentStrengthComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentStrengthComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
