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
import { BarCodeReportComponent } from './bar-code-report/bar-code-report.component';
import { AdmissionProcessReportComponent } from './admission-process-report/admission-process-report.component';
import { PrevSchoolReportComponent } from './prev-school-report/prev-school-report.component';
import { StudentEnqAdmnRegReportComponent } from './student_enq_admn_reg_report/student-enq-admn-reg-report/student-enq-admn-reg-report.component';
import { SlctcReportComponent } from './slctc-report/slctc-report.component';
import { RemarksReportComponent } from './remarks-report/remarks-report.component';
import { UtilizationReportComponent } from './utilization-report/utilization-report.component';
import { PromotionReportComponent } from './promotion-report/promotion-report.component';

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
		SkillAndAwardsReportComponent,
		BarCodeReportComponent,
		AdmissionProcessReportComponent,
		PrevSchoolReportComponent,
		StudentEnqAdmnRegReportComponent,
		SlctcReportComponent,
		RemarksReportComponent,
		UtilizationReportComponent,
		PromotionReportComponent
	],
	providers: [TranslateService],
})
export class ReportsModule { }
