import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeGroupComponent } from './fee-group.component';

describe('FeeGroupComponent', () => {
	let component: FeeGroupComponent;
	let fixture: ComponentFixture<FeeGroupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ FeeGroupComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeeGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
