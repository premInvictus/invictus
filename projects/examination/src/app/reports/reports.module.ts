import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { MarksRegisterComponent } from './marks-register/marks-register.component';
import { PerformanceReportsComponent } from './performance-reports/performance-reports.component';
import { RecordAssessmentsComponent } from './record-assessments/record-assessments.component';
import { ExamSharedModule } from '../exam-shared/exam-shared.module';
import { ReportComponent } from './report/report.component';
import { StudentAttendenceComponent } from './student-attendence/student-attendence.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ExamSharedModule,
    AngularSlickgridModule.forRoot()
  ],
  declarations: [MarksRegisterComponent, PerformanceReportsComponent, RecordAssessmentsComponent, ReportComponent, StudentAttendenceComponent],
  providers: [TranslateService]
})
export class ReportsModule { }
