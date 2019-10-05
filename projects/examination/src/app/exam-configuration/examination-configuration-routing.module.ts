import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { ExamComponent } from './exam/exam.component';
import { SubExamComponent } from './sub-exam/sub-exam.component';
import { GradecardSettingComponent } from './gradecard-setting/gradecard-setting.component';
import { UploadMarksComponent } from './upload-marks/upload-marks.component';

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
		path: 'gradecard-setting', component: GradecardSettingComponent
	},
	{
		path: 'upload-marks', component: UploadMarksComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExaminationConfigurationRoutingModule { }
