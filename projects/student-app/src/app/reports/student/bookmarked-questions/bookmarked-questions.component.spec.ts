import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkedQuestionsComponent } from './bookmarked-questions.component';

describe('BookmarkedQuestionsComponent', () => {
	let component: BookmarkedQuestionsComponent;
	let fixture: ComponentFixture<BookmarkedQuestionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ BookmarkedQuestionsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BookmarkedQuestionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
