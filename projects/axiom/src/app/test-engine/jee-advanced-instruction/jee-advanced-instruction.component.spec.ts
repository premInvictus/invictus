import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeAdvancedInstructionComponent } from './jee-advanced-instruction.component';

describe('JeeAdvancedInstructionComponent', () => {
	let component: JeeAdvancedInstructionComponent;
	let fixture: ComponentFixture<JeeAdvancedInstructionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeAdvancedInstructionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeAdvancedInstructionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
