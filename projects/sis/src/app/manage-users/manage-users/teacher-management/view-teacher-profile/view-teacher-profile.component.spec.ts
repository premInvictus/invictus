import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeacherProfileComponent } from './view-teacher-profile.component';

describe('ViewTeacherProfileComponent', () => {
	let component: ViewTeacherProfileComponent;
	let fixture: ComponentFixture<ViewTeacherProfileComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ViewTeacherProfileComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewTeacherProfileComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
