import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrettyExpenseLogComponent } from './pretty-expense-log.component';

describe('PrettyExpenseLogComponent', () => {
	let component: PrettyExpenseLogComponent;
	let fixture: ComponentFixture<PrettyExpenseLogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PrettyExpenseLogComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PrettyExpenseLogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
