import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacherwise',
  templateUrl: './teacherwise.component.html',
  styleUrls: ['./teacherwise.component.css']
})
export class TeacherwiseComponent implements OnInit {

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
    this.examService.getSubmissionTeacherwise(this.param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        console.log(result.data);
        this.printData = result.data;
        this.tableDivFlag = true;
      }
    })
  }
  getReviewStatus(eme_class_id, eme_term_id,eme_sub_id,eme_sec_id,eme_exam_id,eme_subexam_id) {
    status = '';
    if(this.printData.examMarkArr.length > 0) {
      this.printData.examMarkArr.forEach(element => {
        if(element.eme_class_id === eme_class_id && element.eme_term_id === eme_term_id && element.eme_sub_id === eme_sub_id
          && element.eme_sec_id === eme_sec_id && element.eme_exam_id === eme_exam_id && element.eme_subexam_id === eme_subexam_id){
            //status = element.eme_review_status;
            const tstatus = Number(element.eme_review_status);
            if(tstatus === 4) {
              status = 'fas fa-thumbs-up text-published'
            } else if(tstatus > 0 && tstatus < 4) {
              status = 'fas fa-check text-submitted';
            }
          }
      });
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

}
