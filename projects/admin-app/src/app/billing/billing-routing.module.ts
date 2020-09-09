import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolListingComponent } from './school-listing/school-listing.component';
import { SchoolLedgerComponent } from './school-ledger/school-ledger.component';

const routes: Routes = [
  { path: 'school-listing', component: SchoolListingComponent },
	{ path: 'school-ledger', component: SchoolLedgerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
