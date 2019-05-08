import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryThemeTwoComponent } from './enquiry-theme-two/enquiry-theme-two.component';
import { RegistrationThemeTwoComponent } from './registration-theme-two/registration-theme-two.component';
import { ProvisionalThemeTwoComponent } from './provisional-theme-two/provisional-theme-two.component';
import { AdmissionThemeTwoComponent } from './admission-theme-two/admission-theme-two.component';
import { AluminiThemeTwoComponent } from './alumini-theme-two/alumini-theme-two.component';
import { StudentDetailsThemeTwoComponent } from './student-details-theme-two/student-details-theme-two.component';
import { ChildDetailsThemeTwoComponent } from './child-details-theme-two/child-details-theme-two.component';
import { ParentDetailsThemeTwoComponent } from './parent-details-theme-two/parent-details-theme-two.component';
import { MedicalInformationThemeTwoComponent } from './medical-information-theme-two/medical-information-theme-two.component';
import { EducationDetailsThemeTwoComponent } from './education-details-theme-two/education-details-theme-two.component';
import { SkillsAwardsThemeTwoComponent } from './skills-awards-theme-two/skills-awards-theme-two.component';
import { DocumentsThemeTwoComponent } from './documents-theme-two/documents-theme-two.component';
import { GeneralRemarksThemeTwoComponent } from './general-remarks-theme-two/general-remarks-theme-two.component';
import { ManagementRemarksThemeTwoComponent } from './management-remarks-theme-two/management-remarks-theme-two.component';
import { AdmissionRemarksThemeTwoComponent } from './admission-remarks-theme-two/admission-remarks-theme-two.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { StudentMasterThemeTwoRoutingModule } from './student-master-theme-two-routing.module';
import { CapitalizePipe } from '../_pipes/index';

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
