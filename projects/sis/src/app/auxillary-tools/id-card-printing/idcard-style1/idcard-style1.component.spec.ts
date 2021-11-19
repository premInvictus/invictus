import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardStyle1Component } from './idcard-style1.component';

describe('IdcardStyle1Component', () => {
	let component: IdcardStyle1Component;
	let fixture: ComponentFixture<IdcardStyle1Component>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ IdcardStyle1Component ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IdcardStyle1Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
