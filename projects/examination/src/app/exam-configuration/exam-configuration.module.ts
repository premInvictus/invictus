import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { ExaminationConfigurationRoutingModule } from './examination-configuration-routing.module';
import { SetupComponent } from './setup/setup.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { ExamComponent } from './exam/exam.component';
import { SubExamComponent } from './sub-exam/sub-exam.component';
import { GradecardSettingComponent } from './gradecard-setting/gradecard-setting.component';
import { UploadMarksComponent } from './upload-marks/upload-marks.component';
import { SubjectSubexamMappingComponent } from './subject-subexam-mapping/subject-subexam-mapping.component';
import { SubjectSubexamModalComponent } from './subject-subexam-mapping/subject-subexam-modal/subject-subexam-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExamAliasTermwiseComponent } from './exam-alias-termwise/exam-alias-termwise.component';


@NgModule({
	imports: [
		CommonModule,
		LoadingModule,
		ExaminationConfigurationRoutingModule,
		ExamSharedModule,
		ColorPickerModule
	],
	declarations: [SetupComponent, ExamComponent, SubExamComponent, GradecardSettingComponent, UploadMarksComponent, SubjectSubexamMappingComponent, SubjectSubexamModalComponent, ExamAliasTermwiseComponent],
	entryComponents: [SubjectSubexamModalComponent]
})
export class ExamConfigurationModule { }
