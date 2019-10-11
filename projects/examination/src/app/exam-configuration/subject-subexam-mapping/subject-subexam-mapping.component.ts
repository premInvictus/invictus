import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './subject-subexam.model';
import { SubjectSubexamModalComponent } from './subject-subexam-modal/subject-subexam-modal.component';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-subject-subexam-mapping',
  templateUrl: './subject-subexam-mapping.component.html',
  styleUrls: ['./subject-subexam-mapping.component.css']
})
export class SubjectSubexamMappingComponent implements OnInit {

  subjectsubexamArr: any[] = [];
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['class_name', 'exam_name', 'se_name', 'subjects', 'action'];
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
    this.getSubjectSubexamMapping();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(SubjectSubexamModalComponent, {
      width: '80%',
      height: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
  getSubjectSubexamMapping(){
    this.subjectsubexamArr = [];
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.examService.getSubjectSubexamMapping({}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        const temp = result.data;
        console.log(temp);
        for(let item of temp) {
          this.ELEMENT_DATA.push({
            class_name: item.class_name,
            exam_name: item.exam_name,
            se_name: item.sexam_name,
            subjects: item.sub_name + ' - ' + item.ssm_sub_mark,
            action: item,
          });
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.tableDivFlag = true;
      }
    })

  }

}
