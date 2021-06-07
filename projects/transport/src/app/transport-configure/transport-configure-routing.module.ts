import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { SlabsComponent } from './slabs/slabs.component';
import { StoppageComponent } from './stoppage/stoppage.component';
import { RouteComponent } from './route/route.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { SystemInfoComponent } from './system-info/system-info.component';

const routes: Routes = [
  {path:'setup',component:SystemInfoComponent},
  {path:'slabs',component:SlabsComponent},
  {path:'stoppage',component:StoppageComponent},
  {path:'route',component:RouteComponent},
  {path:'checklist',component:ChecklistComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportConfigureRoutingModule { }
