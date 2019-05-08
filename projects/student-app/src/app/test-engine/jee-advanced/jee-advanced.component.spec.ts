import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedComponent } from './jee-advanced.component';

describe('JeeAdvancedComponent', () => {
	let component: JeeAdvancedComponent;
	let fixture: ComponentFixture<JeeAdvancedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeAdvancedComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeAdvancedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
