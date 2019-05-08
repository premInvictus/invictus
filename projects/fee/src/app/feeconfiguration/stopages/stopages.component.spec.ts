import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopagesComponent } from './stopages.component';

describe('StopagesComponent', () => {
	let component: StopagesComponent;
	let fixture: ComponentFixture<StopagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StopagesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StopagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
