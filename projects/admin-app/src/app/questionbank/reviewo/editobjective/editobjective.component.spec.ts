import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditobjectiveComponent } from './editobjective.component';

describe('EditobjectiveComponent', () => {
	let component: EditobjectiveComponent;
	let fixture: ComponentFixture<EditobjectiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ EditobjectiveComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EditobjectiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
