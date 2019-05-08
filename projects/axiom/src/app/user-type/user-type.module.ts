import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserTypeRoutingModule } from './user-type-routing.module';
import { AdminComponent } from './admin/admin.component';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TabsModule } from 'ngx-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from '../shared-module/share-module.module';
import { UserCredentialComponent } from './user-credential/user-credential.component';
@NgModule({
	imports: [
		CommonModule,
		UserTypeRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		ModalModule.forRoot(),
		CollapseModule.forRoot(),
		ChartsModule,
		SimpleNotificationsModule.forRoot(),
		LoadingModule,
		TabsModule.forRoot(),
		TreeviewModule.forRoot(),
		SharedModule,
	],
	declarations: [
		AdminComponent,
		TeacherComponent,
		StudentComponent,
		AdminDashboardComponent,
		TeacherDashboardComponent,
		StudentDashboardComponent,
		SchoolComponent,
		SchoolDashboardComponent,
		SchoolsetupComponent,
		AccesscontrolComponent,
		CreateNewUserComponent,
		ManageAccessComponent,
		CreateNewSchoolComponent,
		UserCredentialComponent
	],
	providers: []
})
export class UserTypeModule { }
