import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from '../_guards/index';
import { AcsetupRoutingModule } from './acsetup-routing.module';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';
import { AcsetupService } from './service/acsetup.service';
import { UserManagementComponent } from './manage-users/user-management/user-management.component';
import { TeacherManagementComponent } from './manage-users/teacher-management/teacher-management.component';
import { StudentManagementComponent } from './manage-users/student-management/student-management.component';
import { ParentManagementComponent } from './manage-users/parent-management/parent-management.component';
import { CreateNewUserComponent } from './manage-users/user-management/create-new-user/create-new-user.component';
import { CreateNewTeacherComponent } from './manage-users/teacher-management/create-new-teacher/create-new-teacher.component';
import { ManageAccessUserComponent } from './manage-users/user-management/manage-access-user/manage-access-user.component';
import { CreateNewStudentComponent } from './manage-users/student-management/create-new-student/create-new-student.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from '../shared-module/share-module.module';
// tslint:disable-next-line:max-line-length
import { StudentDashboardManagementComponent } from './manage-users/student-management/student-dashboard-management/student-dashboard-management.component';
import { ViewTeacherProfileComponent } from './manage-users/teacher-management/view-teacher-profile/view-teacher-profile.component';
import { SystemInfoUploadComponent } from './system-info-upload/system-info-upload.component';
import { ViewStudentProfileComponent } from './manage-users/student-management/view-student-profile/view-student-profile.component';
import { SearchStudentComponent } from './manage-users/student-management/view-student-profile/search-student/search-student.component';
import { SearchTeacherComponent } from './manage-users/teacher-management/view-teacher-profile/search-teacher/search-teacher.component';
import { ChangePasswordModalComponent } from './manage-users/change-password-modal/change-password-modal.component';
import { UserMappingComponent } from './manage-users/user-mapping/user-mapping.component';


@NgModule({
	imports: [
		CommonModule,
		AcsetupRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		LoadingModule,
		SimpleNotificationsModule,
		SharedModule,
		TreeviewModule.forRoot()
	],

	entryComponents: [SearchStudentComponent, SearchTeacherComponent, ChangePasswordModalComponent],
	// tslint:disable-next-line:max-line-length
	declarations: [SysteminfoComponent, UserManagementComponent, TeacherManagementComponent, StudentManagementComponent, ParentManagementComponent, CreateNewUserComponent, CreateNewTeacherComponent, ManageAccessUserComponent, CreateNewStudentComponent, StudentDashboardManagementComponent, ViewTeacherProfileComponent, SystemInfoUploadComponent, ViewStudentProfileComponent, SearchStudentComponent, SearchTeacherComponent, ChangePasswordModalComponent, UserMappingComponent],
	providers: [AcsetupService, AuthGuard, NotificationsService]
})

export class AcsetupModule { }
