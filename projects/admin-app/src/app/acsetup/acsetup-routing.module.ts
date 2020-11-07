import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAccessGuard, AuthGuard } from '../_guards/index';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';
import { UserManagementComponent } from './manage-users/user-management/user-management.component';
import { TeacherManagementComponent } from './manage-users/teacher-management/teacher-management.component';
import { StudentManagementComponent } from './manage-users/student-management/student-management.component';
import { ParentManagementComponent } from './manage-users/parent-management/parent-management.component';
import { CreateNewUserComponent } from './manage-users/user-management/create-new-user/create-new-user.component';
import { CreateNewTeacherComponent } from './manage-users/teacher-management/create-new-teacher/create-new-teacher.component';
import { ManageAccessUserComponent } from './manage-users/user-management/manage-access-user/manage-access-user.component';
import { CreateNewStudentComponent } from './manage-users/student-management/create-new-student/create-new-student.component';
// tslint:disable-next-line:max-line-length
import { StudentDashboardManagementComponent } from './manage-users/student-management/student-dashboard-management/student-dashboard-management.component';
import { ViewTeacherProfileComponent } from './manage-users/teacher-management/view-teacher-profile/view-teacher-profile.component';
import { SystemInfoUploadComponent } from './system-info-upload/system-info-upload.component';
import { ViewStudentProfileComponent } from './manage-users/student-management/view-student-profile/view-student-profile.component';
import {QuestionPaperSyncComponent} from './question-paper-sync/question-paper-sync.component';

const routes: Routes = [
	{
		path: '', children: [
			{ path: 'systeminfo', component: SysteminfoComponent, canActivate: [AuthGuard] },
			{ path: 'user-management', component: UserManagementComponent },
			{ path: 'teacher-management', component: TeacherManagementComponent },
			{ path: 'student-management', component: StudentManagementComponent },
			{ path: 'parent-management', component: ParentManagementComponent },
			{ path: 'create-new-user', component: CreateNewUserComponent },
			{ path: 'create-new-teacher', component: CreateNewTeacherComponent },
			{ path: 'manage-access-user/:id', component: ManageAccessUserComponent },
			{ path: 'create-new-student', component: CreateNewStudentComponent },
			{ path: 'student-dashboard-management', component: StudentDashboardManagementComponent },
			{ path: 'view-teacher-profile', component: ViewTeacherProfileComponent },
			{ path: 'system-info-upload' , component: SystemInfoUploadComponent },
			{ path: 'view-student-profile', component: ViewStudentProfileComponent},
			{path:'question-paper-sync', component:QuestionPaperSyncComponent}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AcsetupRoutingModule { }
