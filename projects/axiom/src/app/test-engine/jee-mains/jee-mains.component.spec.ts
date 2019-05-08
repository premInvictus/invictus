import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeMainsComponent } from './jee-mains.component';

describe('JeeMainsComponent', () => {
	let component: JeeMainsComponent;
	let fixture: ComponentFixture<JeeMainsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JeeMainsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JeeMainsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
