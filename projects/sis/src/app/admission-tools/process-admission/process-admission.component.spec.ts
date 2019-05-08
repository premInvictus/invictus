import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAdmissionComponent } from './process-admission.component';

describe('ProcessAdmissionComponent', () => {
	let component: ProcessAdmissionComponent;
	let fixture: ComponentFixture<ProcessAdmissionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ProcessAdmissionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProcessAdmissionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
