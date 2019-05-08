import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAwardsComponent } from './skills-awards.component';

describe('SkillsAwardsComponent', () => {
	let component: SkillsAwardsComponent;
	let fixture: ComponentFixture<SkillsAwardsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SkillsAwardsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SkillsAwardsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
