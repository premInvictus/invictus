import { Component, OnInit, ViewChild } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-unpuslish-exam',
  templateUrl: './unpuslish-exam.component.html',
  styleUrls: ['./unpuslish-exam.component.css']
})
export class UnpuslishExamComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  subSubjectArray: any[] = [];
  sectionArray: any[] = [];
  termsArray: any[] = [];
  examArray: any[] = [];
  subexamArray: any[] = [];
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
  ) { }
  getClassTerm() {
    this.termsArray = [];
    this.examService.getClassTerm({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        result.data.ect_no_of_term.split(',').forEach(element => {
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSectionsByClass() {
    this.paramform.patchValue({
      eme_term_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_exam_id: '',
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
  getSubType() {
    const ind = this.subSubjectArray.findIndex(e => e.sub_id === this.paramform.value.eme_sub_id);
    if (ind !== -1) {
      return this.subSubjectArray[ind].sub_type;
    } else {
      return '1';
    }
  }
  getExamDetails() {
    this.examArray = [];
    this.paramform.patchValue({
      eme_exam_id: ''
    });
    this.examService.getExamDetails({ exam_class: this.paramform.value.eme_class_id, term_id: this.paramform.value.eme_term_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  buildForm() {
    this.paramform = this.fbuild.group({
      eme_class_id: '',
      eme_sec_id: '',
      eme_sub_id: '',
      eme_term_id: '',
      eme_exam_id: '',
      eme_review_status:''
    })
  }
  getClass() {
    this.classArray = [];
    this.smartService.getClassData({ class_status: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classArray = result.data;
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getSubjectsByClass() {
    this.subjectArray = [];
    this.smartService.getSubjectsByClass({ class_id: this.paramform.value.eme_class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subSubjectArray = result.data;
        const temp = result.data;
        let scholastic_subject: any[] = [];
        let coscholastic_subject: any[] = [];
        if (temp.length > 0) {

          temp.forEach(element => {
            // if (element.sub_parent_id && element.sub_parent_id === '0') {
            //   const childSub: any[] = [];
            //   for (const item of temp) {
            //     if (element.sub_id === item.sub_parent_id) {
            //       childSub.push(item);
            //     }
            //   }
            //   element.childSub = childSub;
            //   this.subjectArray.push(element);
            // }
            if (element.sub_type === '1' || element.sub_type === '3') {
              if (element.sub_parent_id && element.sub_parent_id === '0') {
                var childSub: any[] = [];
                for (const item of temp) {
                  if (element.sub_id === item.sub_parent_id) {
                    childSub.push(item);
                  }
                }
                element.childSub = childSub;
                scholastic_subject.push(element);
              }
            } else if (element.sub_type === '2' || element.sub_type === '4') {
              if (element.sub_parent_id && element.sub_parent_id === '0') {
                var childSub: any[] = [];
                for (const item of temp) {
                  if (element.sub_id === item.sub_parent_id) {
                    childSub.push(item);
                  }
                }
                element.childSub = childSub;
                coscholastic_subject.push(element);
              }
            }
          });
        }

        for (var i = 0; i < scholastic_subject.length; i++) {
          this.subjectArray.push(scholastic_subject[i]);
        }
        for (var i = 0; i < coscholastic_subject.length; i++) {
          this.subjectArray.push(coscholastic_subject[i]);
        }
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubexamName(se_id) {
    return this.subexamArray.find(e => e.se_id === se_id).sexam_name;
  }

  getSubjectName() {
    for (const item of this.subSubjectArray) {
      if (item.sub_id === this.paramform.value.eme_sub_id) {
        return item.sub_name;
      }
    }
  }
  updateStatusMarksInput(){
    if(this.paramform.valid) {
      this.paramform.patchValue({
        eme_review_status: '0'
      });
      this.examService.updateStatusMarksInput(this.paramform.value).subscribe((result: any) => {
        if(result && result.status === 'ok') {
          this.commonAPIService.showSuccessErrorMessage(result.message,'success');
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message,'error');
        }
      })
    }
  }

}
