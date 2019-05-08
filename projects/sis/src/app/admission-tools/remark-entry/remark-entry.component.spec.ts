import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkEntryComponent } from './remark-entry.component';

describe('RemarkEntryComponent', () => {
	let component: RemarkEntryComponent;
	let fixture: ComponentFixture<RemarkEntryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ RemarkEntryComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RemarkEntryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
