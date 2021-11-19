import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPaperListComponent } from './question-paper-list.component';

describe('QuestionPaperListComponent', () => {
	let component: QuestionPaperListComponent;
	let fixture: ComponentFixture<QuestionPaperListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ QuestionPaperListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuestionPaperListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
