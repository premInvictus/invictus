import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementRemarksThemeTwoComponent } from './management-remarks-theme-two.component';

describe('ManagementRemarksThemeTwoComponent', () => {
	let component: ManagementRemarksThemeTwoComponent;
	let fixture: ComponentFixture<ManagementRemarksThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ManagementRemarksThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManagementRemarksThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
