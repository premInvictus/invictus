import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdCardPrintingComponent } from './id-card-printing.component';

describe('IdCardPrintingComponent', () => {
	let component: IdCardPrintingComponent;
	let fixture: ComponentFixture<IdCardPrintingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IdCardPrintingComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IdCardPrintingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
