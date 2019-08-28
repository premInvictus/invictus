import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { CbseMarksAnalysisComponent } from './cbse-marks-analysis/cbse-marks-analysis.component';

const routes: Routes = [
	{
		path: 'grade-card', component: GradecardPrintingComponent,
	},
	{
		path: 'additional-subject', component: AdditionalSubjectComponent
	},
	{
		path: 'marks-analysis', component: CbseMarksAnalysisComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
