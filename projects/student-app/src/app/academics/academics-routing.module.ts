import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LiveLocationComponent } from './live-location/live-location.component'

const routes: Routes = [
	{path: 'view-classwork', component: ViewClassworkComponent},
	{path: 'assignment', component: AssignmentComponent},
	{path: 'timetable', component: TimetableComponent},
	{path: 'live-location', component:LiveLocationComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AcademicsRoutingModule { }
