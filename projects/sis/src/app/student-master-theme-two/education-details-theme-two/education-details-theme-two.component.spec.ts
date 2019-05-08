import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationDetailsThemeTwoComponent } from './education-details-theme-two.component';

describe('EducationDetailsThemeTwoComponent', () => {
	let component: EducationDetailsThemeTwoComponent;
	let fixture: ComponentFixture<EducationDetailsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EducationDetailsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EducationDetailsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
