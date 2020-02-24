import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-classwise',
  templateUrl: './classwise.component.html',
  styleUrls: ['./classwise.component.css']
})
export class ClasswiseComponent implements OnInit, OnChanges {

  @Input() param: any;
  tableDivFlag = false;
  printData: any;
  constructor(
    private examService: ExamService
  ) { }

  ngOnInit() {
    
  }
  ngOnChanges() {
    console.log(this.param);
    if(this.param.eme_submit == true) {
      this.displayData();
    } else {
      this.tableDivFlag = false;
    }
  }

  displayData() {
    this.examService.getSubmissionClasswise(this.param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        console.log(result.data);
        this.printData = result.data;
        this.tableDivFlag = true;
      }
    })
  }
  getReviewStatus(eme_class_id, eme_term_id,eme_sub_id,eme_sec_id,eme_exam_id,eme_subexam_id) {
    status = '-';
    if(this.printData.examMarkArr.length > 0) {
      this.printData.examMarkArr.forEach(element => {
        if(element.eme_class_id === eme_class_id && element.eme_term_id === eme_term_id && element.eme_sub_id === eme_sub_id
          && element.eme_sec_id === eme_sec_id && element.eme_exam_id === eme_exam_id && element.eme_subexam_id === eme_subexam_id){
            //status = element.eme_review_status;
            const tstatus = Number(element.eme_review_status);
            if(tstatus === 4) {
              // status = 'fas fa-thumbs-up text-published'
              //status = 'Published'
              status = '<span class="text-published">Published</span>';
            } else if(tstatus > 0 && tstatus < 4) {
              //status = 'Submitted';
              status = '<span class="text-submitted">Submitted</span>';
            } else if(tstatus === 0) {
              //status = 'Inprogress';
              status = '<span class="text-inprogress">Inprogress</span>';
            }
          }
      });
    }
    if(status === '-') {
      if(this.printData.subjectSubexamArr.length > 0) {
        this.printData.subjectSubexamArr.forEach(element => {
          if(element.ssm_class_id === eme_class_id && element.ssm_exam_id === eme_exam_id && element.ssm_se_id === eme_subexam_id && element.ssm_sub_id === eme_sub_id) {
            if(Number(element.ssm_sub_mark) > 0) {
              //status = 'Yet to start';
              status = '<span class="text-yettostart">Yet to start</span>';
            }
          }
        });
      }
    }
    return status;
  }

  examActivityCategoryName(id) {
    let name = '';
    this.printData.examActivityArr.forEach(element => {
      if(element.eac_id == id) {
        name = element.eac_name;
      }
    });
    return name;
  }
  getTeacherName(class_id,sub_id,sec_id){
    let name = '';
    if(this.printData.teacherArr.length > 0) {
      this.printData.teacherArr.forEach(element => {
        if(element.uc_class_id === class_id && element.uc_sec_id === sec_id && element.uc_sub_id === sub_id) {
          name = element.au_full_name;
        }
      });
    }
    return name;
  }

}
