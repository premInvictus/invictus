import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { FaSharedModule } from '../fa-shared/sharedmodule.module';
import { AccountWiseComponent } from './account-wise/account-wise.component';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FaSharedModule,
    AngularSlickgridModule.forRoot()

  ],
  declarations: [ReportsComponent, AccountWiseComponent

     ]
})
export class ReportsModule { }
