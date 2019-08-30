import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolStudentReportsComponent } from './school-student-reports/school-student-reports.component';
const routes: Routes = [
	{ path: '', component: SchoolStudentReportsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentReportsRoutingModule { }
