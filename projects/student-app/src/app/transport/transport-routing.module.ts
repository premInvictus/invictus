import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveLocationComponent } from './live-location/live-location.component';
const routes: Routes = [
  {path:'live-location', component:LiveLocationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportRoutingModule { }
