import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentDetailsThemeTwoComponent } from './parent-details-theme-two.component';

describe('ParentDetailsThemeTwoComponent', () => {
	let component: ParentDetailsThemeTwoComponent;
	let fixture: ComponentFixture<ParentDetailsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ParentDetailsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParentDetailsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
