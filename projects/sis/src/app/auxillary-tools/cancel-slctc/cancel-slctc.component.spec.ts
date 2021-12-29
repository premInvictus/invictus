import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSlctcComponent } from './cancel-slctc.component';

describe('CancelSlctcComponent', () => {
	let component: CancelSlctcComponent;
	let fixture: ComponentFixture<CancelSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CancelSlctcComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CancelSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
