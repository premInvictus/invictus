import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from '../_guards/index';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ManageUsersService } from './service/manage-users.service';
import { UserManagementComponent } from './manage-users/user-management/user-management.component';
import { TeacherManagementComponent } from './manage-users/teacher-management/teacher-management.component';
import { CreateNewUserComponent } from './manage-users/user-management/create-new-user/create-new-user.component';
import { CreateNewTeacherComponent } from './manage-users/teacher-management/create-new-teacher/create-new-teacher.component';
import { ManageAccessUserComponent } from './manage-users/user-management/manage-access-user/manage-access-user.component';
import { TreeviewModule } from 'ngx-treeview';
import { ViewTeacherProfileComponent } from './manage-users/teacher-management/view-teacher-profile/view-teacher-profile.component';
import { SearchTeacherComponent } from './manage-users/teacher-management/view-teacher-profile/search-teacher/search-teacher.component';
import { BulkInsertComponent } from './bulk-insert/bulk-insert.component';

@NgModule({
	imports: [
		CommonModule,
		ManageUsersRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedmoduleModule,
		TreeviewModule.forRoot()
	],

	entryComponents: [SearchTeacherComponent],
	declarations: [
		UserManagementComponent,
		TeacherManagementComponent,
		CreateNewUserComponent,
		CreateNewTeacherComponent,
		ManageAccessUserComponent,
		ViewTeacherProfileComponent,
		SearchTeacherComponent,
		BulkInsertComponent],
	providers: [ManageUsersService, AuthGuard]
})

export class ManageUsersModule { }
