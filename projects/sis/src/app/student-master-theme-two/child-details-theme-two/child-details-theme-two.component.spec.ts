import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDetailsThemeTwoComponent } from './child-details-theme-two.component';

describe('ChildDetailsThemeTwoComponent', () => {
	let component: ChildDetailsThemeTwoComponent;
	let fixture: ComponentFixture<ChildDetailsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ChildDetailsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChildDetailsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
