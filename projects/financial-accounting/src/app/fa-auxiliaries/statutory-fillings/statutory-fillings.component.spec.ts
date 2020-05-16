import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryFillingsComponent } from './statutory-fillings.component';

describe('StatutoryFillingsComponent', () => {
	let component: StatutoryFillingsComponent;
	let fixture: ComponentFixture<StatutoryFillingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StatutoryFillingsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StatutoryFillingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
