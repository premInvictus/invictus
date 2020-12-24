import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { ProjectComponent } from 'src/app/invictus-shared/project/project.component';
import { ViewProfileComponent } from './admin/view-profile/view-profile.component';

const routes: Routes = [
	{
		path: '',
		component: ProjectComponent,
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
				path: 'template',
				loadChildren: 'projects/admin-app/src/app/questiontemplate/questiontemplate.module#QuestiontemplateModule'
			},
			{
				path: 'questionpaper',
				loadChildren: 'projects/admin-app/src/app/questionpaper/questionpaper.module#QuestionpaperModule'
			},
			{
				path: 'question_paper_setup',
				loadChildren: 'projects/admin-app/src/app/question-paper-setup/question-paper-setup.module#QuestionPaperSetupModule'
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
				path: 'schoolsetup',
				component: SchoolsetupComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'view_profile',
				component: ViewProfileComponent,
			},
			{ path: 'create_new_user', component: CreateNewUserComponent },
			{ path: 'manage-access/:id', component: ManageAccessComponent },
			{ path: 'create-new-school', component: CreateNewSchoolComponent },
			{ path: 'user-credential', component: UserCredentialComponent },
			{
				path: 'billing',
				loadChildren:
					'projects/admin-app/src/app/billing/billing.module#BillingModule'
			},
			{
				path: 'support',
				loadChildren:
					'projects/admin-app/src/app/support/support.module#SupportModule'
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminUserTypeRoutingModule {}
