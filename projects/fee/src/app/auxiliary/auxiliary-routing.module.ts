import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeControlToolComponent } from './cheque-control-tool/cheque-control-tool.component';

const routes: Routes = [
	{ path: 'cheque-control-tool', component: ChequeControlToolComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuxiliaryRoutingModule { }
