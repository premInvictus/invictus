import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountGroupComponent } from './fa-account-group/fa-account-group.component';
import { DefaultAccountTypeComponent } from './fa-default-account-type/fa-default-account-type.component';
import { LedgerReportComponent } from './fa-ledger-group/fa-ledger-group.component';
import { MasterRecordsComponent } from './fa-master-records/fa-master-records.component';
import { PositionMappingComponent } from './fa-position-mapping/fa-position-mapping.component';
import { SystemInfoComponent } from './system-info/system-info.component';

const routes: Routes = [
  
  { path: 'system-info', component: SystemInfoComponent },
  { path: 'account-group', component: AccountGroupComponent },
  { path: 'default-account-type', component: DefaultAccountTypeComponent },
  { path: 'ledger-report', component: LedgerReportComponent },
  { path: 'master-records', component: MasterRecordsComponent },
  { path: 'position-mapping', component: PositionMappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaConfigureRoutingModule { }
