import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalreviewquestionComponent } from './externalreviewquestion.component';

describe('ExternalreviewquestionComponent', () => {
	let component: ExternalreviewquestionComponent;
	let fixture: ComponentFixture<ExternalreviewquestionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExternalreviewquestionComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalreviewquestionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
