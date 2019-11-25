import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRecordsComponent } from './student-records.component';

describe('StudentRecordsComponent', () => {
	let component: StudentRecordsComponent;
	let fixture: ComponentFixture<StudentRecordsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StudentRecordsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentRecordsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
