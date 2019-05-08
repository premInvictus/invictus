import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { FeemasterModule } from './../feemaster/feemaster.module';
import { ReportsModule } from '../reports/reports.module';
import { AuxiliaryModule } from './../auxiliary/auxiliary.module';
import { FeeconfigurationModule } from './../feeconfiguration/feeconfiguration.module';
const routes: Routes = [
	{
		path: '', redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', component: SchoolComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'feeconfiguration', loadChildren: () => FeeconfigurationModule},
			{ path: 'feemaster', loadChildren: () => FeemasterModule},
			{ path: 'reports', loadChildren: () => ReportsModule},
			{ path: 'auxiliary', loadChildren: () => AuxiliaryModule}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	providers: [AuthGuard],
	exports: [RouterModule]
})
export class UserTypeRoutingModule {
	constructor() {
	}
}
