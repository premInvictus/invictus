import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiryThemeTwoComponent } from './enquiry-theme-two/enquiry-theme-two.component';
import { RegistrationThemeTwoComponent } from './registration-theme-two/registration-theme-two.component';
import { ProvisionalThemeTwoComponent } from './provisional-theme-two/provisional-theme-two.component';
import { AdmissionThemeTwoComponent } from './admission-theme-two/admission-theme-two.component';
import { AluminiThemeTwoComponent } from './alumini-theme-two/alumini-theme-two.component';
const routes: Routes = [
	{ path: '', component: EnquiryThemeTwoComponent },
	{ path: 'enquiry', component: EnquiryThemeTwoComponent },
	{ path: 'registration', component: RegistrationThemeTwoComponent },
	{ path: 'provisional', component: ProvisionalThemeTwoComponent },
	{ path: 'admission', component: AdmissionThemeTwoComponent },
	{ path: 'alumini', component: AluminiThemeTwoComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StudentMasterThemeTwoRoutingModule { }
