import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSlctcComponent } from './config-slctc.component';

describe('ConfigSlctcComponent', () => {
	let component: ConfigSlctcComponent;
	let fixture: ComponentFixture<ConfigSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ConfigSlctcComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfigSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
