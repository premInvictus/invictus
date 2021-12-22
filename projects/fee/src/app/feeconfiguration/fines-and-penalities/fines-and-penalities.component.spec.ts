import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAndPenalitiesComponent } from './fines-and-penalities.component';

describe('FinesAndPenalitiesComponent', () => {
	let component: FinesAndPenalitiesComponent;
	let fixture: ComponentFixture<FinesAndPenalitiesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FinesAndPenalitiesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinesAndPenalitiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
