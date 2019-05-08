import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProvisionalComponent } from './provisional/provisional.component';
import { AdmissionComponent } from './admission/admission.component';
import { AluminiComponent } from './alumini/alumini.component';
import { BlankComponent } from './blank/blank.component';

const routes: Routes = [
	{ path: '', component: EnquiryComponent },
	{ path: 'enquiry', component: EnquiryComponent },
	{ path: 'registration', component: RegistrationComponent },
	{ path: 'provisional', component: ProvisionalComponent },
	{ path: 'admission', component: AdmissionComponent },
	{ path: 'alumini', component: AluminiComponent },
	{ path: 'blank', component: BlankComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentMasterRoutingModule { }
