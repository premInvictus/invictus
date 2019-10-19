import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificatePrintingComponent } from './certificate-printing/certificate-printing.component';

const routes: Routes = [
	{ path: '', component: CertificatePrintingComponent },
	{ path: 'certificate-printing', component: CertificatePrintingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificatePrintingRoutingModule { }
