import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkuploadComponent } from './bulkupload/bulkupload.component';
import { IndividualentryComponent } from './individualentry/individualentry.component';

const routes: Routes = [
	{ path: '', component: IndividualentryComponent },
	{ path: 'bupload_questions', component: BulkuploadComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionRoutingModule { }
