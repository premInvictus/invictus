import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicReportsRoutingModule } from './dynamic-reports-routing.module';
import { DynamicReportComponent } from './dynamic-report/dynamic-report.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
	imports: [
		CommonModule,
		DynamicReportsRoutingModule,
		SharedmoduleModule,
		DragDropModule,
		MatRadioModule,
		MatCheckboxModule
	],
	declarations: [DynamicReportComponent]
})
export class DynamicReportsModule { }
