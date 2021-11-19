import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionCategoryComponent } from './concession-category.component';

describe('ConcessionCategoryComponent', () => {
	let component: ConcessionCategoryComponent;
	let fixture: ComponentFixture<ConcessionCategoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ConcessionCategoryComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConcessionCategoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
