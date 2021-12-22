import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
	BsDropdownModule,
	TooltipModule,
	ModalModule,
	CollapseModule,
	TabsModule
} from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoadingModule } from 'ngx-loading';
import { TreeviewModule } from 'ngx-treeview';
import { DownCertificateComponent } from './down-certificate.component';
import { DownCertificateRoutingModule } from './down-certificate.routing.module';

@NgModule({
	imports: [
		CommonModule,
        DownCertificateRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		ModalModule.forRoot(),
		CollapseModule.forRoot(),
		SharedModuleModule,
		ChartsModule,
		SimpleNotificationsModule.forRoot(),
		LoadingModule,
		TabsModule.forRoot(),
		TreeviewModule.forRoot(),
		
	],
	declarations: [
        DownCertificateComponent
		]
})
export class DownCertificateModule {}
