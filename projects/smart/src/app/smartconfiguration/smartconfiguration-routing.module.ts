import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemInfoComponent} from '../smartconfiguration/system-info/system-info.component';
const routes: Routes = [
	{
		path: 'system-info', component: SystemInfoComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SmartconfigurationRoutingModule { }
