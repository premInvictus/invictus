import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountGroupComponent } from './fa-account-group/fa-account-group.component';
import { MasterRecordsComponent } from './fa-master-records/fa-master-records.component';
import { PositionMappingComponent } from './fa-position-mapping/fa-position-mapping.component';
import { SystemInfoComponent } from './system-info/system-info.component'
import { FaConfigureRoutingModule } from './fa-configure-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { AccountPositionComponent } from './account-position/account-position.component';
@NgModule({
  imports: [
    CommonModule,
    FaConfigureRoutingModule,
    FaSharedModule
  ],
  declarations: [ AccountGroupComponent,
    MasterRecordsComponent,
    PositionMappingComponent,
     SystemInfoComponent,
     AccountPositionComponent]
})
export class FaConfigureModule { }
