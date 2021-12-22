import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSlctcPrintComponent } from './view-slctc-print.component';

describe('ViewSlctcPrintComponent', () => {
	let component: ViewSlctcPrintComponent;
	let fixture: ComponentFixture<ViewSlctcPrintComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewSlctcPrintComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewSlctcPrintComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
