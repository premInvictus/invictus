import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTemplateListComponent } from './generic-template-list.component';

describe('GenericTemplateListComponent', () => {
	let component: GenericTemplateListComponent;
	let fixture: ComponentFixture<GenericTemplateListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ GenericTemplateListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GenericTemplateListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
