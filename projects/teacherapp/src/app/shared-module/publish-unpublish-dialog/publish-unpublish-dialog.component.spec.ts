import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishUnpublishDialogComponent } from './publish-unpublish-dialog.component';

describe('PublishUnpublishDialogComponent', () => {
	let component: PublishUnpublishDialogComponent;
	let fixture: ComponentFixture<PublishUnpublishDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PublishUnpublishDialogComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PublishUnpublishDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
