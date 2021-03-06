import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineClassesRoutingModule } from './online-classes-routing.module';
import { LoadingModule } from 'ngx-loading';
import { SmartSharedModule } from '../smart-shared/smart-shared.module';
import { ScheduleclassesComponent } from './scheduleclasses/scheduleclasses.component';
import { BlockaccessesComponent } from './blockaccesses/blockaccesses.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@NgModule({
  imports: [
    CommonModule,
    OnlineClassesRoutingModule,
    LoadingModule,
    SmartSharedModule
  ],
  declarations: [ScheduleclassesComponent, BlockaccessesComponent, BulkUploadComponent],
	entryComponents: []
})
export class OnlineClassesModule { }
