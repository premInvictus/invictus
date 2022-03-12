import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportReportsRoutingModule } from './transport-reports-routing.module';
import { TyreLogReportsComponent } from './tyre-log-reports/tyre-log-reports.component';
import { ReportComponent } from './report/report.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { MatCardModule, MatSelectModule, MatDatepickerModule, MatInputModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { FuelLogReportsComponent } from './fuel-log-reports/fuel-log-reports.component';
import { ServiceLogReportsComponent } from './service-log-reports/service-log-reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RunningLogReportsComponent } from './running-log-reports/running-log-reports.component';


@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TransportReportsRoutingModule,
    AngularSlickgridModule.forRoot()
  ],
  declarations: [
    TyreLogReportsComponent, 
    ReportComponent, FuelLogReportsComponent, ServiceLogReportsComponent, RunningLogReportsComponent],
  providers: [TranslateService]
})
export class TransportReportsModule { }
