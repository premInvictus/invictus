import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsThemeTwoComponent } from './documents-theme-two.component';

describe('DocumentsThemeTwoComponent', () => {
	let component: DocumentsThemeTwoComponent;
	let fixture: ComponentFixture<DocumentsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DocumentsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DocumentsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
