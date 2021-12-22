import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassReportsComponent } from './class-reports.component';

describe('ClassReportsComponent', () => {
	let component: ClassReportsComponent;
	let fixture: ComponentFixture<ClassReportsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ClassReportsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClassReportsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
