import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalreviewsubjectiveComponent } from './externalreviewsubjective.component';

describe('ExternalreviewsubjectiveComponent', () => {
	let component: ExternalreviewsubjectiveComponent;
	let fixture: ComponentFixture<ExternalreviewsubjectiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExternalreviewsubjectiveComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalreviewsubjectiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
