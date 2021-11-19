import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReturnComponent } from './admin-return.component';

describe('AdminReturnComponent', () => {
	let component: AdminReturnComponent;
	let fixture: ComponentFixture<AdminReturnComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdminReturnComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminReturnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
