import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignStoreComponent } from './assign-store/assign-store.component';
import { StoreAssignListComponent } from './store-assign-list/store-assign-list.component';
import { GenerateBillComponent } from './generate-bill/generate-bill.component';

const routes: Routes = [
  { path: 'assign-store', component: AssignStoreComponent },
  { path: 'store-assign-list', component: StoreAssignListComponent },
  { path: 'generate-bill', component: GenerateBillComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInchargeRoutingModule { }
