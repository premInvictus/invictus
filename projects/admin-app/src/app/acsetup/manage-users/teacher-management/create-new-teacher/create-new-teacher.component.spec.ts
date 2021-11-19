import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTeacherComponent } from './create-new-teacher.component';

describe('CreateNewTeacherComponent', () => {
	let component: CreateNewTeacherComponent;
	let fixture: ComponentFixture<CreateNewTeacherComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CreateNewTeacherComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateNewTeacherComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
