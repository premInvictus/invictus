import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryComputationComponent } from './salary-computation.component';

describe('SalaryComputationComponent', () => {
	let component: SalaryComputationComponent;
	let fixture: ComponentFixture<SalaryComputationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SalaryComputationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SalaryComputationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
