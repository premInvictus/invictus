import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '../_guards/auth.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { RouteAccessGuard } from '../_guards/routeAccess.guard';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: AdminDashboardComponent },
			{
				path: 'setup',
				loadChildren: 'projects/admin-app/src/app/acsetup/acsetup.module#AcsetupModule'
			},
			{
				path: 'questionbank',
				loadChildren: 'projects/admin-app/src/app/questionbank/questionbank.module#QuestionbankModule'
			},
			{
				path: 'question',
				loadChildren: 'projects/admin-app/src/app/question/question.module#QuestionModule'
			},
			{
				path: 'review',
				loadChildren:
					'projects/admin-app/src/app/secondaryreview/secondaryreview.module#SecondaryreviewModule'
			},
			{
				path: 'schoolsetup',
				component: SchoolsetupComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'accesscontrol',
				component: AccesscontrolComponent,
				canActivate: [AuthGuard]
			},
			{ path: 'create_new_user', component: CreateNewUserComponent },
			{ path: 'manage-access/:id', component: ManageAccessComponent },
			{ path: 'create-new-school', component: CreateNewSchoolComponent },
			{ path: 'user-credential', component: UserCredentialComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminUserTypeRoutingModule {}