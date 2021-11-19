import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AluminiStudentListComponent } from './alumini-student-list.component';

describe('AluminiStudentListComponent', () => {
	let component: AluminiStudentListComponent;
	let fixture: ComponentFixture<AluminiStudentListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AluminiStudentListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AluminiStudentListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
