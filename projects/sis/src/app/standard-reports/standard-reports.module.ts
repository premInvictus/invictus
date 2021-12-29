import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardReportsRoutingModule } from './standard-reports-routing.module';
import { AdmissionReportComponent } from './admission-report/admission-report.component';
import { StudentDetailsReportComponent } from './student-details-report/student-details-report.component';
import { StudentStrengthComponent } from './student-strength/student-strength.component';
import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';
import { ProvisionalCertificateComponent } from './provisional-certificate/provisional-certificate.component';
import { TutionCertificateComponent } from './tution-certificate/tution-certificate.component';
import { AluminiStudentListComponent } from './alumini-student-list/alumini-student-list.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSortModule, MatRadioModule } from '@angular/material';
import { WithdrawalReportComponent } from './withdrawal-report/withdrawal-report.component';
import { SiblingDetailsReportComponent } from './sibling-details-report/sibling-details-report.component';
import { DocumentReportComponent } from './document-report/document-report.component';
import { BirthdayReportComponent } from './birthday-report/birthday-report.component';
import { SkillAndAwardsReportComponent } from './skill-and-awards-report/skill-and-awards-report.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
	imports: [
		CommonModule,
		StandardReportsRoutingModule,
		SharedmoduleModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatRadioModule,
		MatSlideToggleModule
	],
	declarations: [AdmissionReportComponent, StudentDetailsReportComponent, StudentStrengthComponent,
		CertificatePrintingComponent, ProvisionalCertificateComponent, TutionCertificateComponent,
		AluminiStudentListComponent, WithdrawalReportComponent, SiblingDetailsReportComponent,
		DocumentReportComponent, BirthdayReportComponent, SkillAndAwardsReportComponent]
})
export class StandardReportsModule { }
