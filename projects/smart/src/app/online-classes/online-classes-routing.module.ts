import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleclassesComponent } from './scheduleclasses/scheduleclasses.component';
import { BlockaccessesComponent } from  './blockaccesses/blockaccesses.component'
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
const routes: Routes = [
	{
		path: 'scheduleclass', component: ScheduleclassesComponent
	},
	{
		path: 'blockaccess', component: BlockaccessesComponent
	},
	{
		path: 'bulkupdate', component: BulkUploadComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineClassesRoutingModule { }
