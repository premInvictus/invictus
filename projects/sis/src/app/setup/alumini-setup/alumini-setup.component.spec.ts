import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AluminiSetupComponent } from './alumini-setup.component';

describe('AluminiSetupComponent', () => {
	let component: AluminiSetupComponent;
	let fixture: ComponentFixture<AluminiSetupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AluminiSetupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AluminiSetupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
