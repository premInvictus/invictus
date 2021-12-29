import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentThemeTwoComponent } from './dynamic-content-theme-two.component';

describe('DynamicContentThemeTwoComponent', () => {
	let component: DynamicContentThemeTwoComponent;
	let fixture: ComponentFixture<DynamicContentThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DynamicContentThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicContentThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
