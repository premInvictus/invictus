import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdatesComponent } from './bulk-updates.component';

describe('BulkUpdatesComponent', () => {
	let component: BulkUpdatesComponent;
	let fixture: ComponentFixture<BulkUpdatesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ BulkUpdatesComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BulkUpdatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
