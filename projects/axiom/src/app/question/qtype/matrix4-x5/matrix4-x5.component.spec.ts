import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Matrix4X5Component } from './matrix4-x5.component';

describe('Matrix4X5Component', () => {
	let component: Matrix4X5Component;
	let fixture: ComponentFixture<Matrix4X5Component>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ Matrix4X5Component ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(Matrix4X5Component);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
