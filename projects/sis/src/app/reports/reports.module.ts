import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule, MatSortModule, MatRadioModule } from '@angular/material';

import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';

import { AdmissionReportComponent } from './admission-report/admission-report.component';
import { StudentDetailsReportComponent } from './student-details-report/student-details-report.component';
import { StudentStrengthComponent } from './student-strength/student-strength.component';
import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';
import { ProvisionalCertificateComponent } from './provisional-certificate/provisional-certificate.component';
import { TutionCertificateComponent } from './tution-certificate/tution-certificate.component';
import { AluminiStudentListComponent } from './alumini-student-list/alumini-student-list.component';
import { WithdrawalReportComponent } from './withdrawal-report/withdrawal-report.component';
import { SiblingDetailsReportComponent } from './sibling-details-report/sibling-details-report.component';
import { DocumentReportComponent } from './document-report/document-report.component';
import { BirthdayReportComponent } from './birthday-report/birthday-report.component';
import { SkillAndAwardsReportComponent } from './skill-and-awards-report/skill-and-awards-report.component';
import { ReportComponent } from './report/report.component';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		SharedmoduleModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatRadioModule,
		MatSlideToggleModule,
		AngularSlickgridModule.forRoot()
	],
	declarations: [
		ReportComponent,
		AdmissionReportComponent,
		StudentDetailsReportComponent,
		StudentStrengthComponent,
		CertificatePrintingComponent,
		ProvisionalCertificateComponent,
		TutionCertificateComponent,
		AluminiStudentListComponent,
		WithdrawalReportComponent,
		SiblingDetailsReportComponent,
		DocumentReportComponent,
		BirthdayReportComponent,
		SkillAndAwardsReportComponent
	],
	providers: [TranslateService],
})
export class ReportsModule { }
