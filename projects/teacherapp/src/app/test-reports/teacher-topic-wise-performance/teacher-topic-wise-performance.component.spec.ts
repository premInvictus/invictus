import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTopicWisePerformanceComponent } from './teacher-topic-wise-performance.component';

describe('TeacherTopicWisePerformanceComponent', () => {
	let component: TeacherTopicWisePerformanceComponent;
	let fixture: ComponentFixture<TeacherTopicWisePerformanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherTopicWisePerformanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherTopicWisePerformanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
