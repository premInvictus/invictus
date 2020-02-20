import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { PercentageCumulativeExamModalComponent } from './percentage-cumulative-exam-modal/percentage-cumulative-exam-modal.component';
import { PercentageCumulativeSubjectModalComponent } from './percentage-cumulative-subject-modal/percentage-cumulative-subject-modal.component';
import { PercentageCumulativeExamComponent } from './percentage-cumulative-exam/percentage-cumulative-exam.component';
import { PercentageCumulativeSubjectComponent } from './percentage-cumulative-subject/percentage-cumulative-subject.component';

@Component({
  selector: 'app-percentage-cumulative-setup',
  templateUrl: './percentage-cumulative-setup.component.html',
  styleUrls: ['./percentage-cumulative-setup.component.css']
})
export class PercentageCumulativeSetupComponent implements OnInit {

  currentTabIndex: any;
  @ViewChild(PercentageCumulativeExamComponent) pcem: PercentageCumulativeExamComponent
  @ViewChild(PercentageCumulativeSubjectComponent) pcsm: PercentageCumulativeSubjectComponent
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentTabIndex = 0;
  }
  setIndex(event) {
		this.currentTabIndex = event;
  }
  openDialog(data=null): void {
    if(this.currentTabIndex === 0) {
      const dialogRef = this.dialog.open(PercentageCumulativeSubjectModalComponent, {
        width: '80%',
        height: '80%',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.list) {
          this.pcsm.getExamPerCumulativeSubject();
        }
      });
    } else if(this.currentTabIndex === 1) {
      const dialogRef = this.dialog.open(PercentageCumulativeExamModalComponent, {
        width: '30%',
        height: '50%',
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.list) {
          this.pcem.getExamPerCumulativeExam();
        }
      });
    }
  }

}
undefined