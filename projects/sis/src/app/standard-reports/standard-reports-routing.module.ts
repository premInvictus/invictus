import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
	{ path: '', component: AdmissionReportComponent },
	{ path: 'admission-report', component: AdmissionReportComponent },
	{ path: 'student-details', component: StudentDetailsReportComponent },
	{ path: 'student-strength', component: StudentStrengthComponent },
	{ path: 'withdrawal-reports', component: WithdrawalReportComponent },
	{ path: 'list-of-sibling-students', component: SiblingDetailsReportComponent },
	{ path: 'student-document-reports', component: DocumentReportComponent },
	{ path: 'birthday-report', component: BirthdayReportComponent },
	{ path: 'skills-and-award-reports', component: SkillAndAwardsReportComponent },
	{ path: 'certificate-printing', component: CertificatePrintingComponent },
	{ path: 'pro-certificate', component: ProvisionalCertificateComponent },
	{ path: 'tuition-certificate', component: TutionCertificateComponent },
	{ path: 'alumini-student-list', component: AluminiStudentListComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class StandardReportsRoutingModule { }
