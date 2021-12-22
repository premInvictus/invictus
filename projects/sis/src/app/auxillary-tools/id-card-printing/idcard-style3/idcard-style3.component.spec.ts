import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardStyle3Component } from './idcard-style3.component';

describe('IdcardStyle3Component', () => {
	let component: IdcardStyle3Component;
	let fixture: ComponentFixture<IdcardStyle3Component>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IdcardStyle3Component]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IdcardStyle3Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
