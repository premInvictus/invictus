import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { RepotContainerComponent } from './repot-container/repot-container.component';

const routes: Routes = [
  { path: 'financial--accounting-report', component: RepotContainerComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
