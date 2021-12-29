import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateReviewListComponent } from './template-review-list.component';

describe('TemplateReviewListComponent', () => {
	let component: TemplateReviewListComponent;
	let fixture: ComponentFixture<TemplateReviewListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TemplateReviewListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TemplateReviewListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
