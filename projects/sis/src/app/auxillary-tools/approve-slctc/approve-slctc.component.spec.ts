import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSlctcComponent } from './approve-slctc.component';

describe('ApproveSlctcComponent', () => {
	let component: ApproveSlctcComponent;
	let fixture: ComponentFixture<ApproveSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ApproveSlctcComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ApproveSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
