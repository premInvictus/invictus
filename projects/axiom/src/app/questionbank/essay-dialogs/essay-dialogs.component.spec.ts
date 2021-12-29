import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayDialogsComponent } from './essay-dialogs.component';

describe('EssayDialogsComponent', () => {
	let component: EssayDialogsComponent;
	let fixture: ComponentFixture<EssayDialogsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ EssayDialogsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EssayDialogsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
