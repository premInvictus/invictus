import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './gradecard-printing.model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-gradecard-printing',
  templateUrl: './gradecard-printing.component.html',
  styleUrls: ['./gradecard-printing.component.css']
})
export class GradecardPrintingComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  gradeCardMarkArray: any[] = [];
  studentArray: any[] = [];
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select', 'au_admission_no', 'au_full_name', 'r_rollno', 'class_name', 'status', 'action'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  ngOnInit() { 
    this.buildForm();
    this.getClass();
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.au_login_id}`;
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_term_id: ''
    })
  }

  getClass() {
    this.classArray = [];
    this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({exam_class: this.paramform.value.eme_class_id}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_term_id: '',
    });
    this.tableDivFlag = false;
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.paramform.patchValue({
      eme_sub_id: ''
    });
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subjectArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({class_id: this.paramform.value.eme_class_id}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({id: element, name: result.data.ect_term_alias + ' ' +element});
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getRollNoUser() {
    this.paramform.patchValue({
      eme_term_id: '',
    });
    this.tableDivFlag = false;
    if (this.paramform.value.eme_class_id && this.paramform.value.eme_sec_id) {
      this.studentArray = [];
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.eme_class_id, au_sec_id: this.paramform.value.eme_sec_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }
  getGradeCardMark() {
    const param: any = {};
    param.class_id = this.paramform.value.eme_class_id;
    param.sec_id = this.paramform.value.eme_sec_id;
    param.eme_term_id = this.paramform.value.eme_term_id;
    param.eme_review_status = '4';
    param.login_id = '1144';
    this.examService.getGradeCardMark(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.gradeCardMarkArray = result.data;
        this.tableDivFlag = true;
      } else {
        this.tableDivFlag = true;
      }
    })
  }
  displayData() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    if(this.studentArray.length > 0) {
      this.studentArray.forEach(element => {
        const temp: any = {};
        temp.au_admission_no = element.au_admission_no;
        temp.au_full_name = element.au_full_name;
        temp.au_login_id = element.au_login_id;
        temp.r_rollno = element.r_rollno;
        temp.class_name = element.sec_name ? element.class_name + '-' + element.sec_name : element.class_name;
        temp.status = 'uncleared';
        temp.action = element;
        this.ELEMENT_DATA.push(temp);
      });
      this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    }

  }

}
