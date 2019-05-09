import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentUserTypeRoutingModule } from './student-user-type-routing.module';
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
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentComponent } from './student/student.component';
import { UserCredentialComponent } from './user-credential/user-credential.component';

@NgModule({
	imports: [
		CommonModule,
		StudentUserTypeRoutingModule,
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
		StudentComponent,
		StudentDashboardComponent,
		UserCredentialComponent]
})
export class StudentUserTypeModule {}
