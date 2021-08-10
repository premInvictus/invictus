import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShufflingToolComponent } from './shuffling-tool.component';

describe('ShufflingToolComponent', () => {
	let component: ShufflingToolComponent;
	let fixture: ComponentFixture<ShufflingToolComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ShufflingToolComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShufflingToolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
