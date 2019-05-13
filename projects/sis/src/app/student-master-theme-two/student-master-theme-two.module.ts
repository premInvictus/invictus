import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryThemeTwoComponent } from './enquiry-theme-two/enquiry-theme-two.component';
import { RegistrationThemeTwoComponent } from './registration-theme-two/registration-theme-two.component';
import { ProvisionalThemeTwoComponent } from './provisional-theme-two/provisional-theme-two.component';
import { AdmissionThemeTwoComponent } from './admission-theme-two/admission-theme-two.component';
import { AluminiThemeTwoComponent } from './alumini-theme-two/alumini-theme-two.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { StudentMasterThemeTwoRoutingModule } from './student-master-theme-two-routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedmoduleModule,
		StudentMasterThemeTwoRoutingModule
	],
	declarations: [EnquiryThemeTwoComponent, RegistrationThemeTwoComponent, ProvisionalThemeTwoComponent,
		AdmissionThemeTwoComponent, AluminiThemeTwoComponent]
})
export class StudentMasterThemeTwoModule { }
