import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guards';
import { ProjectComponent } from '../../../../../src/app/invictus-shared/project/project.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';

const routes: Routes = [
	{
		path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
	},
	{
		path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
			{ path: '', component: SchoolDashboardComponent },
			{ path: 'store-master', loadChildren:  '../store-master/store-master.module#StoreMasterModule' },
			{ path: 'auxiliaries', loadChildren:  '../inventory-auxiliaries/auxiliaries.module#AuxiliariesModule' },
			{ path: 'reports', loadChildren:  '../inventory-reports/reports.module#ReportsModule' },
			{ path: 'configuration', loadChildren:  '../inventory-configuration/configuration.module#ConfigurationModule' },
			{ path: 'circulation-management', loadChildren:  '../inventory-circulation-management/circulation-management.module#CirculationManagementModule' }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class InventoryusertypeRoutingModule { }
