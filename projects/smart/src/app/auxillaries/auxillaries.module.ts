import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AuxillariesRoutingModule } from './auxillaries-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { TimeTableComponent } from './time-table/time-table.component';
import { SubjectPeriodCounterComponent } from './subject-period-counter/subject-period-counter.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { TeacherWiseTimetableComponent } from './teacher-wise-timetable/teacher-wise-timetable.component';
import { CombinedTimetableComponent } from './combined-timetable/combined-timetable.component';
import { ClassWiseTimetableComponent } from './class-wise-timetable/class-wise-timetable.component';
import { SchedulerListViewComponent } from './scheduler/scheduler-list-view/scheduler-list-view.component';
import { SchedulerCalenderViewComponent } from './scheduler/scheduler-calender-view/scheduler-calender-view.component';
import { AddSchedulerComponent } from './scheduler/add-scheduler/add-scheduler.component';
// import { AngularCalendarYearViewModule } from 'angular-calendar-year-view';
import { YearlyComponent } from './scheduler/scheduler-calender-view/yearly/yearly.component';
import { MonthlyComponent } from './scheduler/scheduler-calender-view/monthly/monthly.component';
import { WeeklyComponent } from './scheduler/scheduler-calender-view/weekly/weekly.component';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';

@NgModule({
	imports: [
		CommonModule,
		AuxillariesRoutingModule,
		LoadingModule,
		SmartSharedModule,
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
		TimeTableComponent,
		SubjectPeriodCounterComponent,
		SchedulerComponent,
		TeacherWiseTimetableComponent,
		CombinedTimetableComponent,
		ClassWiseTimetableComponent,
		SchedulerListViewComponent,
		SchedulerCalenderViewComponent,
		AddSchedulerComponent,
		YearlyComponent,
		MonthlyComponent,
		WeeklyComponent,
		TeacherTimetableComponent
	],
	entryComponents: [AddSchedulerComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuxillariesModule { }
