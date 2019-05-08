import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTwoTabOneContainerComponent } from './theme-two-tab-one-container.component';

describe('ThemeTwoTabOneContainerComponent', () => {
	let component: ThemeTwoTabOneContainerComponent;
	let fixture: ComponentFixture<ThemeTwoTabOneContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ThemeTwoTabOneContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeTwoTabOneContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
