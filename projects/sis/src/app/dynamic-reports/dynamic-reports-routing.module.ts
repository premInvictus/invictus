import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicReportComponent } from './dynamic-report/dynamic-report.component';

const routes: Routes = [
	{ path: '', component: DynamicReportComponent },
	{ path: 'dynamicreports', component: DynamicReportComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DynamicReportsRoutingModule { }
