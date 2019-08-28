import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarksRegisterComponent } from './marks-register/marks-register.component';
import { PerformanceReportsComponent } from './performance-reports/performance-reports.component';
import { RecordAssessmentsComponent } from './record-assessments/record-assessments.component';

const routes: Routes = [
	{
		path: 'marks-register', component: MarksRegisterComponent,
	},
	{
		path: 'performance-reports', component: PerformanceReportsComponent
	},
	{
		path: 'record-assessment', component: RecordAssessmentsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
