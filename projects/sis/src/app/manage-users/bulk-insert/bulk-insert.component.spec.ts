import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkInsertComponent } from './bulk-insert.component';

describe('BulkInsertComponent', () => {
	let component: BulkInsertComponent;
	let fixture: ComponentFixture<BulkInsertComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BulkInsertComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BulkInsertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
