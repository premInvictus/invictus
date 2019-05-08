import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRemarksThemeTwoComponent } from './general-remarks-theme-two.component';

describe('GeneralRemarksThemeTwoComponent', () => {
	let component: GeneralRemarksThemeTwoComponent;
	let fixture: ComponentFixture<GeneralRemarksThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GeneralRemarksThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GeneralRemarksThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
