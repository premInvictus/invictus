import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursmentSheetComponent } from './disbursment-sheet.component';

describe('DisbursmentSheetComponent', () => {
	let component: DisbursmentSheetComponent;
	let fixture: ComponentFixture<DisbursmentSheetComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DisbursmentSheetComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisbursmentSheetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
