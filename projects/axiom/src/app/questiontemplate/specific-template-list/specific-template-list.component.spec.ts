import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificTemplateListComponent } from './specific-template-list.component';

describe('SpecificTemplateListComponent', () => {
	let component: SpecificTemplateListComponent;
	let fixture: ComponentFixture<SpecificTemplateListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SpecificTemplateListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpecificTemplateListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
