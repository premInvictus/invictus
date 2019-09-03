import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { ExamComponent } from './exam/exam.component';
import { SubExamComponent } from './sub-exam/sub-exam.component';

const routes: Routes = [
	{
		path: 'setup', component: SetupComponent
	},
	{
		path: 'exam', component: ExamComponent
	},
	{
		path: 'sub-exam', component: SubExamComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExaminationConfigurationRoutingModule { }
