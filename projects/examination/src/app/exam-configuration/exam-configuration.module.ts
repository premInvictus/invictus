import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { ExaminationConfigurationRoutingModule } from './examination-configuration-routing.module';
import { SetupComponent } from './setup/setup.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';


@NgModule({
	imports: [
		CommonModule,
		LoadingModule,
		ExaminationConfigurationRoutingModule,
		ExamSharedModule
	],
	declarations: [SetupComponent]
})
export class ExamConfigurationModule { }
