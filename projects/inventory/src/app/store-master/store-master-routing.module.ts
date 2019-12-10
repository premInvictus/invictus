import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordMasterComponent } from './record-master/record-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';
import { ProcurementMasterComponent } from './procurement-master/procurement-master.component';
const routes: Routes = [
	{ path: 'record-master', component: RecordMasterComponent },
	{ path: 'procurement-master', component: ProcurementMasterComponent },
	{ path: 'vendor-master', component: VendorMasterComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StoreMasterRoutingModule { }
