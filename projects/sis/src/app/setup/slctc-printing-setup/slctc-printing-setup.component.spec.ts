import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlctcPrintingSetupComponent } from './slctc-printing-setup.component';

describe('SlctcPrintingSetupComponent', () => {
	let component: SlctcPrintingSetupComponent;
	let fixture: ComponentFixture<SlctcPrintingSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SlctcPrintingSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SlctcPrintingSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
