import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleintegerComponent } from './doubleinteger.component';

describe('DoubleintegerComponent', () => {
	let component: DoubleintegerComponent;
	let fixture: ComponentFixture<DoubleintegerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DoubleintegerComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DoubleintegerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
