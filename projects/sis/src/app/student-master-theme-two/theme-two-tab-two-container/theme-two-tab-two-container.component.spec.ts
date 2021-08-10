import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTwoTabTwoContainerComponent } from './theme-two-tab-two-container.component';

describe('ThemeTwoTabTwoContainerComponent', () => {
	let component: ThemeTwoTabTwoContainerComponent;
	let fixture: ComponentFixture<ThemeTwoTabTwoContainerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ThemeTwoTabTwoContainerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeTwoTabTwoContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
