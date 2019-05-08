import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemarkEntryComponent } from './remark-entry/remark-entry.component';
import { ProcessAdmissionComponent } from './process-admission/process-admission.component';

const routes: Routes = [
	{path: '', component: RemarkEntryComponent},
	{path: 'remark-entry', component: RemarkEntryComponent},
	{path: 'process-admission', component: ProcessAdmissionComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdmissionToolsRoutingModule { }
