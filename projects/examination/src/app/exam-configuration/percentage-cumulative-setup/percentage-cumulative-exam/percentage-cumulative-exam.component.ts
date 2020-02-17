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
  displayedColumns: string[] = ['class_name', 'exams', 'action'];
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
      width: '80%',
      height: '80%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
        let group_result = temp.reduce(function (r, a) {
          r[a.epce_class_id] = r[a.epce_class_id] || [];
          r[a.epce_class_id].push(a);
          return r;
          }, Object.create(null));
        console.log(group_result);
        if(group_result && Object.keys(group_result).length > 0) {
          for(let key in group_result) {
            const eachelement: any = {};
            eachelement.epce_class_id = key;
            const tempSub: any[] = [];
            for(let item of group_result[key]) {
              let temp_type = ';'
              if(item.epce_exam_type === '1') {
                temp_type = 'Theory';
              } else if(item.epce_exam_type === '2') {
                temp_type = 'Practical';
              }
              eachelement.class_name = item.class_name;
              tempSub.push(item.exam_name + ' (' + temp_type + ' - ' + item.epce_exam_weightage + ')');
            }
            eachelement.exams = tempSub;
            eachelement.action = group_result[key];
            this.ELEMENT_DATA.push(eachelement);
          }
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }

}
