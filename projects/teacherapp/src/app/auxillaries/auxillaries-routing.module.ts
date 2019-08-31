import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';
const routes: Routes = [
	{
		path: 'classwise-table', component: TeacherTimetableComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxillariesRoutingModule { }
