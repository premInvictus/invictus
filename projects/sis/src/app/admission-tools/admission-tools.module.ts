import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionToolsRoutingModule } from './admission-tools-routing.module';
import { RemarkEntryComponent } from './remark-entry/remark-entry.component';
import { ProcessAdmissionComponent } from './process-admission/process-admission.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ViewDocumentsComponent } from '../student-master/documents/view-documents/view-documents.component';
import { PreviewDocumentComponent } from '../student-master/documents/preview-document/preview-document.component';

import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
	imports: [
		CommonModule,
		AdmissionToolsRoutingModule,
		SharedmoduleModule,
		MatTableModule,
		MatSortModule
	],
	declarations: [RemarkEntryComponent, ProcessAdmissionComponent],
	entryComponents: []
})
export class AdmissionToolsModule {}
