import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalThemeTwoComponent } from './provisional-theme-two.component';

describe('ProvisionalThemeTwoComponent', () => {
	let component: ProvisionalThemeTwoComponent;
	let fixture: ComponentFixture<ProvisionalThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ProvisionalThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProvisionalThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
