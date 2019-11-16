import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeacherUserTypeRoutingModule } from './user-type-teacher-routing.module';
import { TeacherComponent } from './teacher/teacher.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
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
@NgModule({
	imports: [
		CommonModule,
		TeacherUserTypeRoutingModule,
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
		TeacherComponent,
		TeacherDashboardComponent
	],
	providers: []
})
export class TeacherUserTypeModule { }
