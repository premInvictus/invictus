import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSlctcComponent } from './issue-slctc.component';

describe('IssueSlctcComponent', () => {
	let component: IssueSlctcComponent;
	let fixture: ComponentFixture<IssueSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ IssueSlctcComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IssueSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
