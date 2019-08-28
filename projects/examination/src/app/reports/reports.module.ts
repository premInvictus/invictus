import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { MarksRegisterComponent } from './marks-register/marks-register.component';
import { PerformanceReportsComponent } from './performance-reports/performance-reports.component';
import { RecordAssessmentsComponent } from './record-assessments/record-assessments.component';
import { ExamSharedAppModule } from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ExamSharedAppModule
  ],
  declarations: [MarksRegisterComponent, PerformanceReportsComponent, RecordAssessmentsComponent]
})
export class ReportsModule { }
