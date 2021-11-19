import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSchoolComponent } from './create-new-school.component';

describe('CreateNewSchoolComponent', () => {
	let component: CreateNewSchoolComponent;
	let fixture: ComponentFixture<CreateNewSchoolComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CreateNewSchoolComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateNewSchoolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
