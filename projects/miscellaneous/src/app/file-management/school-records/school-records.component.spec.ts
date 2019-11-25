import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolRecordsComponent } from './school-records.component';

describe('SchoolRecordsComponent', () => {
	let component: SchoolRecordsComponent;
	let fixture: ComponentFixture<SchoolRecordsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SchoolRecordsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SchoolRecordsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
