import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-marks-entry',
  templateUrl: './marks-entry.component.html',
  styleUrls: ['./marks-entry.component.css']
})
export class MarksEntryComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
  studentArray: any[] = [];
  tableDivFlag = false;
  marksInputArray: any[] = [];
  marksEditable = true;
  ngOnInit() {
    this.buildForm();
    this.getClass();
    this.getTermList();
    this.getExamDetails();
    this.getSubExam();
  }

  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog
  ) { }

  openMarkEntryDialog(): void {
    const dialogRef = this.dialog.open(MarksEntryDialog, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
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

  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: ''
    });
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
  getTermList() {
    this.termsArray = [];
    this.smartService.getTermList().subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.termsArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubExam() {
    this.subexamArray = [];
    this.examService.getSubExam({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subexamArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getRollNoUser() {
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
  getSubexamName(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
  }
  displayData() {
    if (this.paramform.value.eme_subexam_id.length > 0) {
      this.marksInputArray = [];
      this.tableDivFlag = true;
    } else {
      this.marksInputArray = [];
      this.tableDivFlag = false;
    }
  }
  enterInputMarks(es_id, login_id, mark) {
    const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
    if (ind !== -1) {
      this.marksInputArray[ind].mark = mark;
    } else {
      this.marksInputArray.push({
        es_id: es_id,
        login_id: login_id,
        mark: mark
      });
    }
    console.log(this.marksInputArray);
  }

  getInputMarks(es_id, login_id) {
    const ind = this.marksInputArray.findIndex(e => e.es_id === es_id && e.login_id === login_id);
    if (ind !== -1) {
      return this.marksInputArray[ind].mark;
    } else {
      return '';
    }
  }

  saveForm(status = 0) {
    if (this.paramform.valid && this.marksInputArray.length > 0) {
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.examEntryMapping = this.marksInputArray;
    }
  }

}

@Component({
  selector: 'marks-entry-dialog',
  templateUrl: 'marks-entry-dialog.html',
})
export class MarksEntryDialog {

  constructor(
    public dialogRef: MatDialogRef<MarksEntryDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}