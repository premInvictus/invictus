import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { SmartconfigurationRoutingModule } from './smartconfiguration-routing.module';
import { SystemInfoComponent } from './system-info/system-info.component';

@NgModule({
	imports: [
		CommonModule,
		LoadingModule,
		SmartconfigurationRoutingModule,
		SmartSharedModule
	],
	declarations: [SystemInfoComponent]
})
export class SmartconfigurationModule { }
 