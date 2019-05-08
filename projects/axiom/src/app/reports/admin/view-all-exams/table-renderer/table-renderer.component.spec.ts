import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRendererComponent } from './table-renderer.component';

describe('TableRendererComponent', () => {
	let component: TableRendererComponent;
	let fixture: ComponentFixture<TableRendererComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TableRendererComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableRendererComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
