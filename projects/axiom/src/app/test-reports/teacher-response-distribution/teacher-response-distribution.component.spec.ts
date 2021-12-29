import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherResponseDistributionComponent } from './teacher-response-distribution.component';

describe('TeacherResponseDistributionComponent', () => {
	let component: TeacherResponseDistributionComponent;
	let fixture: ComponentFixture<TeacherResponseDistributionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherResponseDistributionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherResponseDistributionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
