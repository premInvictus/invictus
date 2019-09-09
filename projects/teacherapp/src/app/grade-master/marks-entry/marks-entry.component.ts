import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { ExamService } from '../../_services/exam.service';
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
  responseMarksArray: any[] = [];
  currentUser: any;
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
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
    this.smartService.getClassByTeacherId({ teacher_id: this.currentUser.login_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_sub_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    });
    this.tableDivFlag = false;
    this.sectionArray = [];
    this.smartService.getSectionByTeacherIdClassId({
      teacher_id: this.currentUser.login_id,
      class_id: this.paramform.value.eme_class_id
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      }
    });
  }
  getSubjectsByClass() {
    this.paramform.patchValue({
      eme_sub_id: ''
    });
    this.subjectArray = [];
    this.smartService.getSubjectByTeacherIdClassIdSectionId({
      teacher_id: this.currentUser.login_id,
      class_id: this.paramform.value.eme_class_id,
      sec_id: this.paramform.value.eme_sec_id
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subjectArray = result.data;
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
    this.paramform.patchValue({
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
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
  getSubexamName(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
  }
  displayData() {
    if (this.paramform.value.eme_subexam_id.length > 0) {
      this.responseMarksArray = [];
      this.marksInputArray = [];
      this.tableDivFlag = true;
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.eme_review_status = ['0', '1', '2', '3', '4'];
      this.examService.getMarksEntry(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          console.log(result.data);
          this.responseMarksArray = result.data;
          if (result.data.length > 0) {
            this.paramform.value.eme_subexam_id.forEach(selement => {
              result.data.forEach(melement => {
                if (selement === melement.examEntry.eme_subexam_id) {
                  melement.examEntryMapping.forEach(element => {
                    this.marksInputArray.push({
                      es_id: melement.examEntry.eme_subexam_id,
                      login_id: element.emem_login_id,
                      mark: element.emem_marks
                    });
                  });
                }
              });
            });
          }
        }
      })
    } else {
      this.marksInputArray = [];
      this.tableDivFlag = false;
    }
  }
  checkEditable(es_id, eme_review_status) {
    if (this.responseMarksArray.length > 0) {
      const rindex = this.responseMarksArray.findIndex(item => item.examEntry.eme_subexam_id === es_id);
      if (rindex === -1) {
        return true;
      } else {
        if (this.responseMarksArray[rindex].examEntry.eme_review_status === eme_review_status) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  isAnyoneEditable(eme_review_status) {
    let status = false;
    if (this.responseMarksArray.length > 0) {
      for (const item of this.responseMarksArray) {
        if (item.examEntry.eme_review_status === eme_review_status) {
          status = true;
          break;
        }
      }
      return status;
    } else {
      return true;
    }
  }
  getSubjectName() {
    for (const item of this.subjectArray) {
      if (item.sub_id === this.paramform.value.eme_sub_id) {
        return item.sub_name;
      }
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

  saveForm(status = '0') {
    if (this.paramform.valid && this.marksInputArray.length > 0) {
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.examEntryMapping = this.marksInputArray;
      param.examEntryStatus = status;
      this.examService.addMarksEntry(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.displayData();
        }
      })
    }
  }
  resetTableDiv() {
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_subexam_id: ''
    });
  }

}
