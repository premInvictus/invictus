import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-failure-list',
  templateUrl: './failure-list.component.html',
  styleUrls: ['./failure-list.component.css']
})
export class FailureListComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  classterm: any;
  subexamArray: any[] = [];
  tableDivFlag = false;
  responseMarksArray: any = {};
  thead_data: any;
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getClass();
  }
  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_subexam_id: ''
    })
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getExamDetails() {
    this.paramform.patchValue({
      eme_exam_id: '',
      eme_subexam_id: '',
    });
    this.examArray = [];
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id,term_id: this.paramform.value.eme_term_id}).subscribe((result: any) => {
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
        console.log(this.subjectArray);
        //this.subjectArray = result.data; 
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classterm = result.data;
        this.getSubjectsByClass();
        console.log(result.data);
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSubExam() {
    this.subexamArray = [];
    if (this.paramform.value.eme_exam_id) {
      this.examService.getExamDetails({exam_class: this.paramform.value.eme_class_id,term_id: this.paramform.value.eme_term_id, exam_id: this.paramform.value.eme_exam_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          if (result.data.length > 0 && result.data[0].exam_sub_exam_max_marks.length > 0) {
            this.subexamArray = result.data[0].exam_sub_exam_max_marks;
            console.log(this.subexamArray);
            const subexam_id_arr: any[] = [];
            for (let item of this.subexamArray) {
              subexam_id_arr.push(item.se_id);
            }
            const param: any = {};
            param.ssm_class_id = this.paramform.value.eme_class_id;
            param.ssm_exam_id = this.paramform.value.eme_exam_id;
            param.ssm_se_id = subexam_id_arr;
            param.ssm_sub_id = this.paramform.value.eme_sub_id;
            this.examService.getSubjectSubexamMapping(param).subscribe((result: any) => {
              if (result && result.status === 'ok') {
                for (let item of result.data) {
                  for (let item1 of this.subexamArray) {
                    if (item.ssm_se_id === item1.se_id) {
                      item1.exam_max_marks = item.ssm_sub_mark;
                    }
                  }
                }
              }
            })
          }
        }
      });
    }
  }
  resetTableDiv() {
    this.tableDivFlag = false;
    this.paramform.patchValue({
      eme_subexam_id: ''
    });
  }
  displayData() {
    if (this.paramform.value.eme_exam_id.length > 0) {
      this.responseMarksArray = {};
      this.examService.getFailureList(this.paramform.value).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.responseMarksArray = result.data;
          console.log('responseMarksArray ---',this.responseMarksArray);
          if(Object.keys(this.responseMarksArray['failureDetails']).length > 0){
            this.thead_data = this.responseMarksArray['failureDetails']['se_id'][0]['subject'][0]['section'];
            console.log('thead_data ---',this.thead_data);
            this.tableDivFlag = true;
          }
        }
      })
    } else {
      this.tableDivFlag = false;
    }
  }
  generateExcel() {
    if (this.paramform.value.eme_exam_id.length > 0) {
      let param: any = Object.assign({}, this.paramform.value) ;
      param.downloadexcel = true;
      this.examService.getFailureList(param).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          console.log(result.data);
          this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
        }
      });
    }
  }

  isEmptyObject(object){
    return Object.keys(object).length === 0
  }

}
