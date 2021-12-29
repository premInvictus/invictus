import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTestQuestionAnalysisComponent } from './teacher-test-question-analysis.component';

describe('TeacherTestQuestionAnalysisComponent', () => {
	let component: TeacherTestQuestionAnalysisComponent;
	let fixture: ComponentFixture<TeacherTestQuestionAnalysisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherTestQuestionAnalysisComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherTestQuestionAnalysisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
