import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryThemeTwoComponent } from './enquiry-theme-two/enquiry-theme-two.component';
import { RegistrationThemeTwoComponent } from './registration-theme-two/registration-theme-two.component';
import { ProvisionalThemeTwoComponent } from './provisional-theme-two/provisional-theme-two.component';
import { AdmissionThemeTwoComponent } from './admission-theme-two/admission-theme-two.component';
import { AluminiThemeTwoComponent } from './alumini-theme-two/alumini-theme-two.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import * as _moment from 'moment';
import { StudentMasterThemeTwoRoutingModule } from './student-master-theme-two-routing.module';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
const moment = _moment;

@NgModule({
	imports: [
		CommonModule,
		SharedmoduleModule,
		StudentMasterThemeTwoRoutingModule
	],
	declarations: [EnquiryThemeTwoComponent, RegistrationThemeTwoComponent, ProvisionalThemeTwoComponent,
		AdmissionThemeTwoComponent, AluminiThemeTwoComponent],
	providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },


]
})
export class StudentMasterThemeTwoModule { }
