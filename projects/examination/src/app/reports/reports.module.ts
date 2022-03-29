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
import { FailureListComponent } from './failure-list/failure-list.component';
import { NegativeReportComponent } from './negative-report/negative-report.component';
import { DetailedGreenSheetComponent } from './detailed-greensheet/detailed-greensheet.component';
import { ComparativeLongListComponent } from './comparative-long-list/comparative-long-list.component';
import { SubmissionReportComponent } from './submission-report/submission-report.component';
import { ClasswiseComponent } from './submission-report/classwise/classwise.component';
import { TeacherwiseComponent } from './submission-report/teacherwise/teacherwise.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ExamSharedModule,
    AngularSlickgridModule.forRoot()
  ],
  declarations: [MarksRegisterComponent, PerformanceReportsComponent, RecordAssessmentsComponent, ReportComponent, StudentAttendenceComponent, FailureListComponent, NegativeReportComponent, DetailedGreenSheetComponent, ComparativeLongListComponent, SubmissionReportComponent, ClasswiseComponent, TeacherwiseComponent],
  providers: [TranslateService]
})
export class ReportsModule { }
