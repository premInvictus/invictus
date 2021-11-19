import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConcludedTestComponent } from './view-concluded-test.component';

describe('ViewConcludedTestComponent', () => {
	let component: ViewConcludedTestComponent;
	let fixture: ComponentFixture<ViewConcludedTestComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewConcludedTestComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewConcludedTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
