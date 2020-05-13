import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRecordsComponent } from './fa-master-records.component';

describe('MasterRecordsComponent', () => {
	let component: MasterRecordsComponent;
	let fixture: ComponentFixture<MasterRecordsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MasterRecordsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterRecordsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
