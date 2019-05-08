import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalFormFieldsComponent } from './global-form-fields.component';

describe('GlobalFormFieldsComponent', () => {
	let component: GlobalFormFieldsComponent;
	let fixture: ComponentFixture<GlobalFormFieldsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GlobalFormFieldsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GlobalFormFieldsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
