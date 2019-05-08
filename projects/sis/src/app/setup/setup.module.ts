import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupRoutingModule } from './setup-routing.module';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';
import { SetupService } from './service/setup.service';
import { EnquirySetupComponent } from './enquiry-setup/enquiry-setup.component';
import { RegistrationSetupComponent } from './registration-setup/registration-setup.component';
import { ProvAdmissionSetupComponent } from './prov-admission-setup/prov-admission-setup.component';
import { AdmissionSetupComponent } from './admission-setup/admission-setup.component';
import { AluminiSetupComponent } from './alumini-setup/alumini-setup.component';
import { IdcardPrintingSetupComponent } from './idcard-printing-setup/idcard-printing-setup.component';
import { SlctcPrintingSetupComponent } from './slctc-printing-setup/slctc-printing-setup.component';
import { CertificatePrintingSetupComponent } from './certificate-printing-setup/certificate-printing-setup.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import {
	MatSlideToggleModule,
	MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatRadioModule, MatSelectModule,
	MatOptionModule
} from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { ExternalEnquirySetupComponent } from './external-enquiry-setup/external-enquiry-setup.component';
import { FieldConfigComponent } from './field-config/field-config.component';
import { GlobalFormFieldsComponent } from './global-form-fields/global-form-fields.component';


@NgModule({
	imports: [
		CommonModule,
		SetupRoutingModule,
		SharedmoduleModule,
		MatSlideToggleModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		ColorPickerModule,
		MatButtonModule,
		MatRadioModule,
		MatSelectModule,
		MatOptionModule
	],
	declarations: [SysteminfoComponent, EnquirySetupComponent, RegistrationSetupComponent,
		ProvAdmissionSetupComponent, AdmissionSetupComponent, AluminiSetupComponent,
		IdcardPrintingSetupComponent, SlctcPrintingSetupComponent,
		CertificatePrintingSetupComponent, ExternalEnquirySetupComponent, FieldConfigComponent, GlobalFormFieldsComponent],
	providers: [SetupService]
})
export class SetupModule { }
