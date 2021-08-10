import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { StudentMasterRoutingModule } from './studentmaster-routing.module';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProvisionalComponent } from './provisional/provisional.component';
import { AdmissionComponent } from './admission/admission.component';
import { AluminiComponent } from './alumini/alumini.component';
import { AddressComponent } from './address/address.component';
import { ViewDocumentsComponent } from './documents/view-documents/view-documents.component';
import { PreviewDocumentComponent } from './documents/preview-document/preview-document.component';
import { BlankComponent } from './blank/blank.component';

@NgModule({
	imports: [
		CommonModule,
		StudentMasterRoutingModule,
		SharedmoduleModule
	],
	declarations: [StudentDetailsComponent, EnquiryComponent, RegistrationComponent, ProvisionalComponent,
		AdmissionComponent, AluminiComponent, AddressComponent, BlankComponent],
	entryComponents: []
})
export class StudentMasterModule { }
