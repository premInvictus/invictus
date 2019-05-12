import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalreviewessayComponent } from './externalreviewessay.component';

describe('ExternalreviewessayComponent', () => {
	let component: ExternalreviewessayComponent;
	let fixture: ComponentFixture<ExternalreviewessayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExternalreviewessayComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalreviewessayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
