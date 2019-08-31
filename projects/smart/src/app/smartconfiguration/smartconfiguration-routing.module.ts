import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemInfoComponent} from '../smartconfiguration/system-info/system-info.component';
import { SmartToAxiomComponent } from './smart-to-axiom/smart-to-axiom.component';
const routes: Routes = [
	{path: 'system-info', component: SystemInfoComponent},
	{path: 'smart-to-axiom', component: SmartToAxiomComponent}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SmartconfigurationRoutingModule { }
