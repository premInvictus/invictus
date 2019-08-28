import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliariesRoutingModule } from './auxiliaries-routing.module';
import { GradecardPrintingComponent } from './gradecard-printing/gradecard-printing.component';
import { AdditionalSubjectComponent } from './additional-subject/additional-subject.component';
import { CbseMarksAnalysisComponent } from './cbse-marks-analysis/cbse-marks-analysis.component';
import { ExamSharedAppModule } from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    AuxiliariesRoutingModule,
    ExamSharedAppModule
  ],
  declarations: [GradecardPrintingComponent, AdditionalSubjectComponent, CbseMarksAnalysisComponent]
})
export class AuxiliariesModule { }
