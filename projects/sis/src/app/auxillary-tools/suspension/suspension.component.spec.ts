import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionComponent } from './suspension.component';

describe('SuspensionComponent', () => {
	let component: SuspensionComponent;
	let fixture: ComponentFixture<SuspensionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SuspensionComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SuspensionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
