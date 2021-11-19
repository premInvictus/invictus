import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTestInstructionComponent } from './ongoing-test-instruction.component';

describe('OngoingTestInstructionComponent', () => {
	let component: OngoingTestInstructionComponent;
	let fixture: ComponentFixture<OngoingTestInstructionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ OngoingTestInstructionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OngoingTestInstructionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
