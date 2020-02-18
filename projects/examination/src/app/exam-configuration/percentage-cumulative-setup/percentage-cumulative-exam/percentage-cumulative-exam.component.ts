import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './percentage-cumulative-exam.model';
import { PercentageCumulativeExamModalComponent } from '../percentage-cumulative-exam-modal/percentage-cumulative-exam-modal.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-percentage-cumulative-exam',
  templateUrl: './percentage-cumulative-exam.component.html',
  styleUrls: ['./percentage-cumulative-exam.component.css']
})
export class PercentageCumulativeExamComponent implements OnInit {

  subjectsubexamArr: any[] = [];
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['class_name', 'exams','type', 'weightage','status', 'action'];
  dataSource = new MatTableDataSource<Element>();
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getExamPerCumulativeExam();
  }
  openDialog(data=null): void {
    const dialogRef = this.dialog.open(PercentageCumulativeExamModalComponent, {
      width: '30%',
      height: '50%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result && result.list) {
        this.getExamPerCumulativeExam();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getSubMark(ssm_class_id,ssm_exam_id,ssm_se_id, arr) {
    const temp: any[] = [];
    for(let item of arr) {
      if(item.ssm_class_id === ssm_class_id && item.ssm_exam_id === ssm_exam_id && item.ssm_se_id === ssm_se_id) {
        temp.push(item.sub_name + '[' + item.ssm_sub_mark + ']');
      }
    }
  }
  getExamPerCumulativeExam(){
    this.subjectsubexamArr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.examService.getExamPerCumulativeExam({}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        const temp = result.data;
        temp.forEach(element => {
          let temp_type = ';'
          if(element.epce_exam_type === '1') {
            temp_type = 'Theory';
          } else if(element.epce_exam_type === '2') {
            temp_type = 'Practical';
          }
          this.ELEMENT_DATA.push({
            class_name: element.class_name,
            exams: element.exam_name,
            type: temp_type,
            weightage: element.epce_exam_weightage,
            status: element.epce_status,
            action: element
          });
          
        });
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }
  toggleStatus(element) {
    if(element.epce_status === '1') {
      element.epce_status = '0';
    } else {
      element.epce_status = '1';
    }
    this.examService.addExamPerCumulativeExam(element).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
        this.getExamPerCumulativeExam();
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    })
  }

}
