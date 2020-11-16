import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/index';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
import { UserCredentialComponent } from 'src/app/invictus-shared/user-credential/user-credential.component';
const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard] , redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard] , component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'feeconfiguration', loadChildren: '../feeconfiguration/feeconfiguration.module#FeeconfigurationModule'},
			{ path: 'feemaster', loadChildren: '../feemaster/feemaster.module#FeemasterModule'},
			{ path: 'reports', loadChildren: 'projects/fee/src/app/reports/reports.module#ReportsModule'},
			{ path: 'auxiliary', loadChildren: '../auxiliary/auxiliary.module#AuxiliaryModule'},
			{ path: 'user-credential', component: UserCredentialComponent},
			{ path: 'wallets',loadChildren: '../wallets/wallets.module#WalletsModule'},
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
