import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardStyle2Component } from './idcard-style2.component';

describe('IdcardStyle2Component', () => {
	let component: IdcardStyle2Component;
	let fixture: ComponentFixture<IdcardStyle2Component>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ IdcardStyle2Component ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IdcardStyle2Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
