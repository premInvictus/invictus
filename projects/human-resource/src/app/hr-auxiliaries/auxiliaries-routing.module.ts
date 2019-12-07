import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminReturnComponent } from './admin-return/admin-return.component';
import { HrEmpMarkAttendanceComponent } from './hr-emp-mark-attendance/hr-emp-mark-attendance.component';
import { IdCardPrintingComponent } from './id-card-printing/id-card-printing.component';
import { BulkUpdatesComponent } from './bulk-updates/bulk-updates.component';

const routes: Routes = [
  { path: 'admin-return', component: AdminReturnComponent },
  { path: 'mark-attendence', component: HrEmpMarkAttendanceComponent },
  { path: 'id-card-printing', component: IdCardPrintingComponent },
  { path: 'bulk-updates', component: BulkUpdatesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliariesRoutingModule { }
