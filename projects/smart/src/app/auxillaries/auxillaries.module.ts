import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxillariesRoutingModule } from './auxillaries-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { TimeTableComponent } from './time-table/time-table.component';
import { SubjectPeriodCounterComponent } from './subject-period-counter/subject-period-counter.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { TeacherWiseTimetableComponent } from './teacher-wise-timetable/teacher-wise-timetable.component';
import { ClassWiseTimetableComponent } from './class-wise-timetable/class-wise-timetable.component';

@NgModule({
	imports: [
		CommonModule,
		AuxillariesRoutingModule,
		LoadingModule,
		SmartSharedModule,
	],
	declarations: [TimeTableComponent, SubjectPeriodCounterComponent, SchedulerComponent, TeacherWiseTimetableComponent, ClassWiseTimetableComponent]
})
export class AuxillariesModule { }
