import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EassessmentRoutingModule } from './eassessment-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxGaugeModule } from 'ngx-gauge';
import { ChartsModule } from 'ng2-charts';
import { StudentScheduleExamComponent } from './student-schedule-exam/student-schedule-exam.component';

@NgModule({
	imports: [
		CommonModule,
		EassessmentRoutingModule,
		EassessmentRoutingModule,
		SharedModuleModule,
		ReactiveFormsModule,
		FormsModule,
		NgxGaugeModule,
		ChartsModule
	],
	declarations: [StudentScheduleExamComponent]
})
export class EassessmentModule {}
