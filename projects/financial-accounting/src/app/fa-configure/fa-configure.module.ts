import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountGroupComponent } from './fa-account-group/fa-account-group.component';
import { DefaultAccountTypeComponent } from './fa-default-account-type/fa-default-account-type.component';
import { LedgerReportComponent } from './fa-ledger-group/fa-ledger-group.component';
import { MasterRecordsComponent } from './fa-master-records/fa-master-records.component';
import { PositionMappingComponent } from './fa-position-mapping/fa-position-mapping.component';
import { SystemInfoComponent } from './system-info/system-info.component'
import { FaConfigureRoutingModule } from './fa-configure-routing.module';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
@NgModule({
  imports: [
    CommonModule,
    FaConfigureRoutingModule,
    FaSharedModule
  ],
  declarations: [ AccountGroupComponent,
    DefaultAccountTypeComponent,
    LedgerReportComponent,
    MasterRecordsComponent,
    PositionMappingComponent,
     SystemInfoComponent]
})
export class FaConfigureModule { }
