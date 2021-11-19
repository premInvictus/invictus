import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAndAwardsReportComponent } from './skill-and-awards-report.component';

describe('SkillAndAwardsReportComponent', () => {
	let component: SkillAndAwardsReportComponent;
	let fixture: ComponentFixture<SkillAndAwardsReportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SkillAndAwardsReportComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SkillAndAwardsReportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
