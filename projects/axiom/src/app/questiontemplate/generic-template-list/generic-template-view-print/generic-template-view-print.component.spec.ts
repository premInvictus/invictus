import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTemplateViewPrintComponent } from './generic-template-view-print.component';

describe('GenericTemplateViewPrintComponent', () => {
	let component: GenericTemplateViewPrintComponent;
	let fixture: ComponentFixture<GenericTemplateViewPrintComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ GenericTemplateViewPrintComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GenericTemplateViewPrintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
