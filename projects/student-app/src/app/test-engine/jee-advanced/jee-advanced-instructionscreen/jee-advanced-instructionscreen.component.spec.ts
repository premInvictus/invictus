import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedInstructionscreenComponent } from './jee-advanced-instructionscreen.component';

describe('JeeAdvancedInstructionscreenComponent', () => {
	let component: JeeAdvancedInstructionscreenComponent;
	let fixture: ComponentFixture<JeeAdvancedInstructionscreenComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeAdvancedInstructionscreenComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeAdvancedInstructionscreenComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
