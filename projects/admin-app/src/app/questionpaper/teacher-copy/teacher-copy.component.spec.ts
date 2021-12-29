import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCopyComponent } from './teacher-copy.component';

describe('TeacherCopyComponent', () => {
	let component: TeacherCopyComponent;
	let fixture: ComponentFixture<TeacherCopyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherCopyComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherCopyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
