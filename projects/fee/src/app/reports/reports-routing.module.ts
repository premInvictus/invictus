import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { Reports2Component } from './reports2/reports2.component';
const routes: Routes = [
	{
		path: '', component: Reports2Component
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportsRoutingModule { }
