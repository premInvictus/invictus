import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsetupComponent } from './schoolsetup.component';

describe('SchoolsetupComponent', () => {
	let component: SchoolsetupComponent;
	let fixture: ComponentFixture<SchoolsetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SchoolsetupComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SchoolsetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
