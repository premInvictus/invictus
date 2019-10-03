import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-marks-register',
  templateUrl: './marks-register.component.html',
  styleUrls: ['./marks-register.component.css']
})
export class MarksRegisterComponent implements OnInit {

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
  exam_grade_type = '0';
  exam_grade_type_arr: any[] = [];
  subExamArray: any[] = [];
  classterm: any;
  absentData = { "egs_grade_name": "AB", "egs_grade_value": "AB", "egs_range_start": "0", "egs_range_end": "0" };
  ngOnInit() {
    this.buildForm();
    this.getClass();
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
      eme_exam_id: ''
    })
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        this.getSubjectsByClass();
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSubType() {
    const ind = this.subjectArray.findIndex(e => e.sub_id === this.paramform.value.eme_sub_id);
    if (ind !== -1) {
      return this.subjectArray[ind].sub_type;
    } else {
      return '1';
    }
  }
  getExamDetails() {
    this.examArray = [];
    this.subexamArray = [];
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, exam_category: this.getSubType() }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        this.subexamArray = result.data[0].exam_sub_exam_max_marks;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getGradeSet(param) {
    this.examService.getGradeSet(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.exam_grade_type_arr = result.data[0].egs_grade_data;
        this.exam_grade_type_arr.push(this.absentData);
      }
    })
  }
  getSubexamName(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
  }
  getSubexamMarks(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).exam_max_marks;
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getSectionsByClass() {
    this.paramform.patchValue({
      eme_sec_id: '',
      eme_term_id: '',
      eme_sub_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
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
        const temp = result.data;
        if (temp.length > 0) {
          temp.forEach(element => {
            if (element.sub_parent_id && element.sub_parent_id === '0') {
              const childSub: any[] = [];
              for (const item of temp) {
                if (element.sub_id === item.sub_parent_id) {
                  childSub.push(item);
                }
              }
              element.childSub = childSub;
              this.subjectArray.push(element);
            }
          });
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getRollNoUser() {
    this.paramform.patchValue({
      eme_term_id: '',
      eme_exam_id: '',
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
  getSubjectName(sub_id) {
    for (const item of this.subjectArray) {
      if (item.sub_id === sub_id) {
        return item.sub_name;
      }
    }
  }
  displayData() {
    if (this.paramform.value.eme_exam_id.length > 0) {
      this.responseMarksArray = [];
      this.marksInputArray = [];
      this.tableDivFlag = true;
      const param: any = {};
      param.examEntry = this.paramform.value;
      param.eme_review_status = ['0', '1', '2', '3', '4'];
      this.examService.getMarksRegister(this.paramform.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.subExamArray = result.data[0].details;
          const subExam = result.data[0].subExam;
          Object.keys(subExam).forEach(key => {
            const subExamArray = [];
            if (key !== '-') {
              Object.keys(subExam[key]).forEach(key1 => {
                subExamArray.push({
                  sexam_id: key1,
                  sub_exam_id: subExam[key][key1]
                });
                //.push(result.data.subExamArray[key][key1]);
              });
              this.responseMarksArray.push({
                sub_id: key,
                dataArr: subExamArray
              });
            }
          });
        }
      })
     console.log(this.responseMarksArray);
    } else {
      this.marksInputArray = [];
      this.tableDivFlag = false;
    }
  }
  getInputMarks(sub_id, es_id, login_id) {
    const ind = this.subExamArray.findIndex(e => Number(e.eme_subexam_id) === Number(es_id)
      && Number(e.emem_login_id) === Number(login_id) && Number(e.eme_sub_id) === Number(sub_id));
    if (ind !== -1) {
      return this.subExamArray[ind].emem_marks;
    } else {
      return '-';
    }

  }
  getInputMarks2(login_id) {
    const ind = this.subExamArray.findIndex(e=> Number(e.emem_login_id) === Number(login_id));
    if (ind !== -1) {
      return 1;
    } else {
      return -1;
    }
  }
  resetTableDiv() {
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_exam_id: ''
    });
  }
}
