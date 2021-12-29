import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './percentage-cumulative-subject.model';
import { PercentageCumulativeSubjectModalComponent } from '../percentage-cumulative-subject-modal/percentage-cumulative-subject-modal.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-percentage-cumulative-subject',
  templateUrl: './percentage-cumulative-subject.component.html',
  styleUrls: ['./percentage-cumulative-subject.component.css']
})
export class PercentageCumulativeSubjectComponent implements OnInit {

  subjectsubexamArr: any[] = [];
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['class_name', 'subjects', 'action'];
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
    this.getExamPerCumulativeSubject();
  }
  openDialog(data=null): void {
    console.log('data---',data);
    const dialogRef = this.dialog.open(PercentageCumulativeSubjectModalComponent, {
      width: '80%',
      height: '80%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.list) {
        this.getExamPerCumulativeSubject();
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
  getExamPerCumulativeSubject(){
    this.subjectsubexamArr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.examService.getExamPerCumulativeSubject({}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        const temp = result.data;
        let group_result = temp.reduce(function (r, a) {
          r[a.epcs_class_id] = r[a.epcs_class_id] || [];
          r[a.epcs_class_id].push(a);
          return r;
          }, Object.create(null));
        console.log(group_result);
        if(group_result && Object.keys(group_result).length > 0) {
          for(let key in group_result) {
            const eachelement: any = {};
            eachelement.epcs_class_id = key;
            const tempSub: any[] = [];
            for(let item of group_result[key]) {
              let temp_type = ';'
              if(item.epcs_subject_type === '1') {
                temp_type = 'Theory';
              } else if(item.epcs_subject_type === '2') {
                temp_type = 'Practical';
              }
              eachelement.class_name = item.class_name;
              tempSub.push(item.sub_name + ' (' + temp_type + ' - ' + item.epcs_calculation_mark + ')');
            }
            eachelement.subjects = tempSub;
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
