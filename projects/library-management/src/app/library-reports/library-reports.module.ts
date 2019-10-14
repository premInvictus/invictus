import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { LibraryReportsRoutingModule } from './library-reports-routing.module';
const routes: Routes = [
	{
		path: '', component: ReportsComponent
	}
];
@NgModule({
  imports: [
    CommonModule,
    LibraryReportsRoutingModule
  ],
  declarations: [ReportsComponent]
})
export class LibraryReportsModule { }
