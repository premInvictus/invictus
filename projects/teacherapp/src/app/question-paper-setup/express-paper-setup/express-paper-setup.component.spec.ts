import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressPaperSetupComponent } from './express-paper-setup.component';

describe('ExpressPaperSetupComponent', () => {
	let component: ExpressPaperSetupComponent;
	let fixture: ComponentFixture<ExpressPaperSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExpressPaperSetupComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExpressPaperSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
