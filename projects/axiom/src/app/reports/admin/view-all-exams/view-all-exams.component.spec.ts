import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllExamsComponent } from './view-all-exams.component';

describe('ViewAllExamsComponent', () => {
	let component: ViewAllExamsComponent;
	let fixture: ComponentFixture<ViewAllExamsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ViewAllExamsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewAllExamsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
