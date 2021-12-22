import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { CertificatePrintingRoutingModule } from './certificate-printing-routing.module';
import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    CertificatePrintingRoutingModule,
    SharedmoduleModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  declarations: [CertificatePrintingComponent]
})
export class CertificatePrintingModule { }
