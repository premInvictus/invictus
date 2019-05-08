import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionGroupComponent } from './concession-group.component';

describe('ConcessionGroupComponent', () => {
	let component: ConcessionGroupComponent;
	let fixture: ComponentFixture<ConcessionGroupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ConcessionGroupComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConcessionGroupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
