import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { SchoolComponent } from './school/school.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { ParentComponent } from './parent/parent.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { UserTypeRoutingModule } from './usertype-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { ParentDashboardComponent } from './parent/parent-dashboard/parent-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { UserRedirectComponent } from './user-redirect/user-redirect.component';



@NgModule({
	imports: [
		CommonModule,
		UserTypeRoutingModule,
		SharedmoduleModule,
	],
	declarations:
		[AdminComponent,
			SchoolComponent,
			TeacherComponent,
			StudentComponent,
			ParentComponent,
			UserCredentialComponent,
			AdminDashboardComponent,
			SchoolDashboardComponent,
			ParentDashboardComponent,
			StudentDashboardComponent,
			TeacherDashboardComponent,
			UserRedirectComponent],

	exports:
		[AdminComponent,
			SchoolComponent,
			TeacherComponent,
			StudentComponent,
			ParentComponent,
			UserCredentialComponent
		]
})
export class UsertypeModule { }
