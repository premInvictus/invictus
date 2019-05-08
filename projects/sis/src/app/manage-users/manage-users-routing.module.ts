import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './manage-users/user-management/user-management.component';
import { TeacherManagementComponent } from './manage-users/teacher-management/teacher-management.component';
import { CreateNewUserComponent } from './manage-users/user-management/create-new-user/create-new-user.component';
import { CreateNewTeacherComponent } from './manage-users/teacher-management/create-new-teacher/create-new-teacher.component';
import { ManageAccessUserComponent } from './manage-users/user-management/manage-access-user/manage-access-user.component';
import { ViewTeacherProfileComponent } from './manage-users/teacher-management/view-teacher-profile/view-teacher-profile.component';
import { BulkInsertComponent } from './bulk-insert/bulk-insert.component';


const routes: Routes = [
	{
		path: '', children: [
			{ path: '', component: UserManagementComponent },
			{ path: 'user-management', component: UserManagementComponent },
			{ path: 'teacher-management', component: TeacherManagementComponent },
			{ path: 'create-new-user', component: CreateNewUserComponent },
			{ path: 'create-new-teacher', component: CreateNewTeacherComponent },
			{ path: 'manage-access-user/:id', component: ManageAccessUserComponent },
			{ path: 'view-teacher-profile', component: ViewTeacherProfileComponent },
			{ path: 'bulk-insert', component: BulkInsertComponent}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
