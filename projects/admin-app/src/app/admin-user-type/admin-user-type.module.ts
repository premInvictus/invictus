import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUserTypeRoutingModule } from './admin-user-type-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
	BsDropdownModule,
	TooltipModule,
	ModalModule,
	CollapseModule,
	TabsModule
} from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TreeviewModule } from 'ngx-treeview';
import { ManageAccessComponent } from './admin/manage-access/manage-access.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';
import { CreateNewSchoolComponent } from './admin/create-new-school/create-new-school.component';
import { CreateNewUserComponent } from './admin/create-new-user/create-new-user.component';
import { AccesscontrolComponent } from './admin/accesscontrol/accesscontrol.component';
import { SchoolsetupComponent } from './admin/schoolsetup/schoolsetup.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
	imports: [
		CommonModule,
		AdminUserTypeRoutingModule,
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
		SharedModuleModule
	],
	declarations: [
		AdminComponent,
		AdminDashboardComponent,
		SchoolsetupComponent,
		AccesscontrolComponent,
		CreateNewUserComponent,
		ManageAccessComponent,
		CreateNewSchoolComponent,
		UserCredentialComponent
	]
})
export class AdminUserTypeModule {}
