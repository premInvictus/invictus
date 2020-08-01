import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownCertificateComponent } from './down-certificate.component';

const routes : Routes = [{
    path : '', component : DownCertificateComponent
}];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class  DownCertificateRoutingModule  {
}