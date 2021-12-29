import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPerformanceTopicsectionWiseComponent } from './class-performance-topicsection-wise.component';

describe('ClassPerformanceTopicsectionWiseComponent', () => {
	let component: ClassPerformanceTopicsectionWiseComponent;
	let fixture: ComponentFixture<ClassPerformanceTopicsectionWiseComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ClassPerformanceTopicsectionWiseComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassPerformanceTopicsectionWiseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
