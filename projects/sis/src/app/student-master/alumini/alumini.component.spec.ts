import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AluminiComponent } from './alumini.component';

describe('AluminiComponent', () => {
	let component: AluminiComponent;
	let fixture: ComponentFixture<AluminiComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AluminiComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AluminiComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
