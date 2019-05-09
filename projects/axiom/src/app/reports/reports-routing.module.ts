import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllExamsComponent } from './admin/view-all-exams/view-all-exams.component';
const routes: Routes = [
	{ path: 'view-exams-all', component: ViewAllExamsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
