import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedOtherInstructionComponent } from './jee-advanced-other-instruction.component';

describe('JeeAdvancedOtherInstructionComponent', () => {
	let component: JeeAdvancedOtherInstructionComponent;
	let fixture: ComponentFixture<JeeAdvancedOtherInstructionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeAdvancedOtherInstructionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeAdvancedOtherInstructionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
