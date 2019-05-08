import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentScoreCardComponent } from './student-score-card.component';

describe('StudentScoreCardComponent', () => {
	let component: StudentScoreCardComponent;
	let fixture: ComponentFixture<StudentScoreCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StudentScoreCardComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StudentScoreCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
