import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificTemplateViewPrintComponent } from './specific-template-view-print.component';

describe('SpecificTemplateViewPrintComponent', () => {
	let component: SpecificTemplateViewPrintComponent;
	let fixture: ComponentFixture<SpecificTemplateViewPrintComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SpecificTemplateViewPrintComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpecificTemplateViewPrintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
