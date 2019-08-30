import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AuxillariesRoutingModule } from './auxillaries-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared-module/share-module.module';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';

@NgModule({
	imports: [
		CommonModule,
		AuxillariesRoutingModule,
		LoadingModule,
		SharedModule,
		// AngularCalendarYearViewModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		ConfirmationPopoverModule.forRoot({
			confirmButtonType: 'danger' // set defaults here
		})
	],
	declarations: [
		TeacherTimetableComponent
	],
	entryComponents: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuxillariesModule { }
