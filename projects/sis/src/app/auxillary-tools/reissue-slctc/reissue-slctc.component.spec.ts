import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueSlctcComponent } from './reissue-slctc.component';

describe('ReissueSlctcComponent', () => {
	let component: ReissueSlctcComponent;
	let fixture: ComponentFixture<ReissueSlctcComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ReissueSlctcComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReissueSlctcComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
