import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquirySetupComponent } from './enquiry-setup/enquiry-setup.component';
import { RegistrationSetupComponent } from './registration-setup/registration-setup.component';
import { ProvAdmissionSetupComponent } from './prov-admission-setup/prov-admission-setup.component';
import { AdmissionSetupComponent } from './admission-setup/admission-setup.component';
import { AluminiSetupComponent } from './alumini-setup/alumini-setup.component';
import { IdcardPrintingSetupComponent } from './idcard-printing-setup/idcard-printing-setup.component';
import { SlctcPrintingSetupComponent } from './slctc-printing-setup/slctc-printing-setup.component';
import { CertificatePrintingSetupComponent } from './certificate-printing-setup/certificate-printing-setup.component';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';
import { ExternalEnquirySetupComponent } from './external-enquiry-setup/external-enquiry-setup.component';
import { FieldConfigComponent } from './field-config/field-config.component';
import { GlobalFormFieldsComponent } from './global-form-fields/global-form-fields.component';

const routes: Routes = [
	{ path: '', component: EnquirySetupComponent },
	{ path: 'enquiry', component: EnquirySetupComponent },
	{ path: 'registration', component: RegistrationSetupComponent },
	{ path: 'provisional-admission', component: ProvAdmissionSetupComponent },
	{ path: 'admission', component: AdmissionSetupComponent },
	{ path: 'alumini', component: AluminiSetupComponent },
	{ path: 'id-card-printing', component: IdcardPrintingSetupComponent },
	{ path: 'slc-tc-printing', component: SlctcPrintingSetupComponent },
	{ path: 'certificate-printing', component: CertificatePrintingSetupComponent },
	{ path: 'global-setup', component: SysteminfoComponent },
	{ path: 'external-enquiry', component: ExternalEnquirySetupComponent },
	{ path: 'field-config', component: FieldConfigComponent },
	{ path: 'global-form-fields', component: GlobalFormFieldsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SetupRoutingModule { }
