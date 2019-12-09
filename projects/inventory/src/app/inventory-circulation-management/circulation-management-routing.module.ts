import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CirculationConsumptionComponent } from './circulation-consumption/circulation-consumption.component';
const routes: Routes = [
	{ path: 'circulation-consumption', component: CirculationConsumptionComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CirculationManagementRoutingModule { }
