import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIdCardComponent } from './print-id-card.component';

describe('PrintIdCardComponent', () => {
	let component: PrintIdCardComponent;
	let fixture: ComponentFixture<PrintIdCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PrintIdCardComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PrintIdCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
