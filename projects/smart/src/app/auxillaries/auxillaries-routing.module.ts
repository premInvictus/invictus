import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimeTableComponent} from '../auxillaries/time-table/time-table.component';
import {SubjectPeriodCounterComponent} from '../auxillaries/subject-period-counter/subject-period-counter.component';
import { TeacherWiseTimetableComponent } from './teacher-wise-timetable/teacher-wise-timetable.component';
import { ClassWiseTimetableComponent } from './class-wise-timetable/class-wise-timetable.component';
import {SchedulerComponent} from '../auxillaries/scheduler/scheduler.component';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';
const routes: Routes = [
	{
		path: 'time-table', component: TimeTableComponent
	},
	{
		path: 'teacherwise-table', component: TeacherWiseTimetableComponent
	},
	{
		path: 'classwise-table', component: ClassWiseTimetableComponent
	},
	{
		path: 'subject-period-counter', component: SubjectPeriodCounterComponent
	},
	{
		path: 'scheduler', component: SchedulerComponent
	},
	{
		path: 'teacher', component: TeacherTimetableComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxillariesRoutingModule { }
