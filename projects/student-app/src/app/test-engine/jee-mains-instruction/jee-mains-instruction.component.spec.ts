import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeMainsInstructionComponent } from './jee-mains-instruction.component';

describe('JeeMainsInstructionComponent', () => {
	let component: JeeMainsInstructionComponent;
	let fixture: ComponentFixture<JeeMainsInstructionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeMainsInstructionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeMainsInstructionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
