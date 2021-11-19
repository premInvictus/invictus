import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTopicSubtopicComponent } from './teacher-topic-subtopic.component';

describe('TeacherTopicSubtopicComponent', () => {
	let component: TeacherTopicSubtopicComponent;
	let fixture: ComponentFixture<TeacherTopicSubtopicComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherTopicSubtopicComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherTopicSubtopicComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
