import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSlctcComponent } from './view-slctc.component';

describe('ViewSlctcComponent', () => {
	let component: ViewSlctcComponent;
	let fixture: ComponentFixture<ViewSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ViewSlctcComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
