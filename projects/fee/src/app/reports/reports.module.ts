import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

@NgModule({
	imports: [
		CommonModule,
		ReportsRoutingModule,
		SharedmoduleModule
	],
	declarations: [ReportsComponent]
})
export class ReportsModule { }
