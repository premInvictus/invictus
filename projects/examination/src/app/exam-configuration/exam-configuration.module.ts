import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { ExaminationConfigurationRoutingModule } from './examination-configuration-routing.module';
import { SetupComponent } from './setup/setup.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { ExamComponent } from './exam/exam.component';
import { SubExamComponent } from './sub-exam/sub-exam.component';
import { UploadMarksComponent } from './upload-marks/upload-marks.component';
import { SubjectSubexamMappingComponent } from './subject-subexam-mapping/subject-subexam-mapping.component';
import { SubjectSubexamModalComponent } from './subject-subexam-mapping/subject-subexam-modal/subject-subexam-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExamAliasTermwiseComponent } from './exam-alias-termwise/exam-alias-termwise.component';
import { PercentageCumulativeSetupComponent } from './percentage-cumulative-setup/percentage-cumulative-setup.component';
import { PercentageCumulativeExamComponent } from './percentage-cumulative-setup/percentage-cumulative-exam/percentage-cumulative-exam.component';
import { PercentageCumulativeSubjectComponent } from './percentage-cumulative-setup/percentage-cumulative-subject/percentage-cumulative-subject.component';
import { PercentageCumulativeExamModalComponent } from './percentage-cumulative-setup/percentage-cumulative-exam-modal/percentage-cumulative-exam-modal.component';
import { PercentageCumulativeSubjectModalComponent } from './percentage-cumulative-setup/percentage-cumulative-subject-modal/percentage-cumulative-subject-modal.component';
import { UnpuslishExamComponent } from './unpuslish-exam/unpuslish-exam.component';


@NgModule({
	imports: [
		CommonModule,
		LoadingModule,
		ExaminationConfigurationRoutingModule,
		ExamSharedModule,
		ColorPickerModule
	],
	declarations: [SetupComponent, ExamComponent, SubExamComponent, UploadMarksComponent, SubjectSubexamMappingComponent, SubjectSubexamModalComponent, ExamAliasTermwiseComponent, PercentageCumulativeSetupComponent, PercentageCumulativeExamComponent, PercentageCumulativeSubjectComponent, PercentageCumulativeExamModalComponent, PercentageCumulativeSubjectModalComponent, UnpuslishExamComponent],
	entryComponents: [SubjectSubexamModalComponent,PercentageCumulativeExamModalComponent,PercentageCumulativeSubjectModalComponent]
})
export class ExamConfigurationModule { }
