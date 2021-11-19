import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AluminiThemeTwoComponent } from './alumini-theme-two.component';

describe('AluminiThemeTwoComponent', () => {
	let component: AluminiThemeTwoComponent;
	let fixture: ComponentFixture<AluminiThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AluminiThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AluminiThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
