import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentGeneralRemarksComponent } from './parent-general-remarks.component';

describe('ParentGeneralRemarksComponent', () => {
	let component: ParentGeneralRemarksComponent;
	let fixture: ComponentFixture<ParentGeneralRemarksComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ParentGeneralRemarksComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParentGeneralRemarksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
