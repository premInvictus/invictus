import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamUserTypeRoutingModule } from './exam-user-type-routing.module';
import { SchoolComponent } from './school/school.component';
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';

@NgModule({
	imports: [
		CommonModule,
    ExamUserTypeRoutingModule,
    ExamSharedModule
	],
	declarations: [SchoolComponent, SchoolDashboardComponent]
})
export class ExamUserTypeModule { }
