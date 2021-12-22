import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeHeadsComponent } from './fee-heads.component';

describe('FeeHeadsComponent', () => {
	let component: FeeHeadsComponent;
	let fixture: ComponentFixture<FeeHeadsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ FeeHeadsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FeeHeadsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
