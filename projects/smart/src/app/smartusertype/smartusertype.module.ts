import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartusertypeRoutingModule } from './smartusertype-routing.module';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { SchoolComponent } from './school/school.component';
import { TeacherComponent } from './teacher/teacher.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';

@NgModule({
	imports: [
		CommonModule,
		SmartusertypeRoutingModule,
		SmartSharedModule,
	],
	declarations: [SchoolComponent,
									TeacherComponent,
									SchoolDashboardComponent,
									TeacherDashboardComponent]
})
export class SmartusertypeModule { }
