import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignStoreComponent } from './assign-store/assign-store.component';

const routes: Routes = [
  { path: 'assign-store', component: AssignStoreComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInchargeRoutingModule { }
