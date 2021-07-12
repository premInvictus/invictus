import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { TimetableComponent } from './timetable/timetable.component';

const routes: Routes = [
	{path: 'view-classwork', component: ViewClassworkComponent},
	{path: 'assignment', component: AssignmentComponent},
	{path: 'timetable', component: TimetableComponent},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AcademicsRoutingModule { }
