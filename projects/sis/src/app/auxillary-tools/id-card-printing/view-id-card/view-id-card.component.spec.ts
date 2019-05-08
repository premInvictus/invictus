import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIdCardComponent } from './view-id-card.component';

describe('ViewIdCardComponent', () => {
	let component: ViewIdCardComponent;
	let fixture: ComponentFixture<ViewIdCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewIdCardComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewIdCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
