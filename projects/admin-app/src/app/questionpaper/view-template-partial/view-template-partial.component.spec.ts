import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplatePartialComponent } from './view-template-partial.component';

describe('ViewTemplatePartialComponent', () => {
	let component: ViewTemplatePartialComponent;
	let fixture: ComponentFixture<ViewTemplatePartialComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewTemplatePartialComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewTemplatePartialComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
