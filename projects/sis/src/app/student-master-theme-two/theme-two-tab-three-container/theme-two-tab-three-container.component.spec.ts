import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTwoTabThreeContainerComponent } from './theme-two-tab-three-container.component';

describe('ThemeTwoTabThreeContainerComponent', () => {
	let component: ThemeTwoTabThreeContainerComponent;
	let fixture: ComponentFixture<ThemeTwoTabThreeContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ThemeTwoTabThreeContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeTwoTabThreeContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
