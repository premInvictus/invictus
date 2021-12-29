import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSlabsComponent } from './transport-slabs.component';

describe('TransportSlabsComponent', () => {
	let component: TransportSlabsComponent;
	let fixture: ComponentFixture<TransportSlabsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransportSlabsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransportSlabsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
