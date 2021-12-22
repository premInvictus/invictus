import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalreviewobjectiveComponent } from './externalreviewobjective.component';

describe('ExternalreviewobjectiveComponent', () => {
	let component: ExternalreviewobjectiveComponent;
	let fixture: ComponentFixture<ExternalreviewobjectiveComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExternalreviewobjectiveComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalreviewobjectiveComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
