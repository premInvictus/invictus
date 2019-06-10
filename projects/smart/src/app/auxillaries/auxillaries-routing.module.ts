import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimeTableComponent} from '../auxillaries/time-table/time-table.component';
import {SubjectPeriodCounterComponent} from '../auxillaries/subject-period-counter/subject-period-counter.component';
import {SchedulerComponent} from '../auxillaries/scheduler/scheduler.component';
const routes: Routes = [
	{
		path: 'time-table', component: TimeTableComponent
	},
	{
		path: 'subject-period-counter', component: SubjectPeriodCounterComponent
	},
	{
		path: 'scheduler', component: SchedulerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxillariesRoutingModule { }
