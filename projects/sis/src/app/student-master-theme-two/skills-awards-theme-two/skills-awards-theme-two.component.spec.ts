import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAwardsThemeTwoComponent } from './skills-awards-theme-two.component';

describe('SkillsAwardsThemeTwoComponent', () => {
	let component: SkillsAwardsThemeTwoComponent;
	let fixture: ComponentFixture<SkillsAwardsThemeTwoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SkillsAwardsThemeTwoComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SkillsAwardsThemeTwoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
