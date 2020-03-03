import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { ExamComponent } from './exam/exam.component';
import { SubExamComponent } from './sub-exam/sub-exam.component';
import { UploadMarksComponent } from './upload-marks/upload-marks.component';
import { SubjectSubexamMappingComponent } from './subject-subexam-mapping/subject-subexam-mapping.component';
import { ExamAliasTermwiseComponent } from './exam-alias-termwise/exam-alias-termwise.component';
import { PercentageCumulativeSetupComponent } from './percentage-cumulative-setup/percentage-cumulative-setup.component';



const routes: Routes = [
	{
		path: 'setup', component: SetupComponent
	},
	{
		path: 'exam', component: ExamComponent
	},
	{
		path: 'sub-exam', component: SubExamComponent
	},
	{
		path: 'upload-marks', component: UploadMarksComponent
	},
	{
		path: 'subject-subexam-mapping', component: SubjectSubexamMappingComponent
	},
	{
		path: 'exam-alias-termwise', component: ExamAliasTermwiseComponent
	},
	{
		path: 'percentage-cumulative-setup', component: PercentageCumulativeSetupComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExaminationConfigurationRoutingModule { }
