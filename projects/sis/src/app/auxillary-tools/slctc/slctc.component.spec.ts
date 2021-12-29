import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlctcComponent } from './slctc.component';

describe('SlctcComponent', () => {
	let component: SlctcComponent;
	let fixture: ComponentFixture<SlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SlctcComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
