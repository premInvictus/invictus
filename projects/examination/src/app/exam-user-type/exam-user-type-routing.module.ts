import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';

const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent }]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [AuthGuard]
})
export class ExamUserTypeRoutingModule { }
