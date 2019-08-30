import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassReportsComponent } from './class-reports/class-reports.component';

const routes: Routes = [
	{ path: '', component: ClassReportsComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ClassPerformanceReportsRoutingModule { }
