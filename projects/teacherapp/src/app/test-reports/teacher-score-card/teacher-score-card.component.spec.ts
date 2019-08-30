import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherScoreCardComponent } from './teacher-score-card.component';

describe('TeacherScoreCardComponent', () => {
	let component: TeacherScoreCardComponent;
	let fixture: ComponentFixture<TeacherScoreCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TeacherScoreCardComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeacherScoreCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
