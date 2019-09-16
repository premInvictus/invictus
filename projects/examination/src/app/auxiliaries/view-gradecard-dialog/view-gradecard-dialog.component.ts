import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';

@Component({
  selector: 'app-view-gradecard-dialog',
  templateUrl: './view-gradecard-dialog.component.html',
  styleUrls: ['./view-gradecard-dialog.component.css']
})
export class ViewGradecardDialogComponent implements OnInit {

  studentDetails: any;
  currentSession: any;
  defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
  subjectArray: any[] = [];
  examArray: any[] = [];
  gradeCardMarkArray: any[] = [];
  sflag = false;
  eflag = false;
  gflag = false;
  constructor(
    public dialogRef: MatDialogRef<ViewGradecardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService
  ) { }

  ngOnInit() {
    this.currentSession = JSON.parse(localStorage.getItem('session'));
    console.log(this.data);
    this.getSession();
    this.getAllStudents();
    this.getSubjectsByClass();
    //this.getExamDetails();
    //this.getGradeCardMark();
    
  }
  getCalculatedMarks(sub_id, exam_id) {
    const curExam = this.examArray.find(e => e.exam_id === exam_id);

  }
  getGradeCardMark() {
    const param: any = {};
    param.class_id = this.data.param.eme_class_id;
    param.sec_id = this.data.param.eme_sec_id;
    param.eme_term_id = this.data.param.eme_term_id;
    param.eme_review_status = '4';
    param.login_id = this.data.au_login_id;
    this.examService.getGradeCardMark(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.gradeCardMarkArray = result.data;
      }
      this.gflag = true;
    });
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({exam_class: this.data.class_id}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        this.eflag = true;
        this.getGradeCardMark();
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getSubjectsByClass() {
    this.subjectArray = [];
    this.smartService.getSubjectsByClass({ class_id: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.subjectArray = result.data;
        this.sflag = true;
        this.getExamDetails();
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }

  getSession() {
    this.sisService.getSession().subscribe((result: any) => {
      if(result && result.status === 'ok') {
        for(const item of result.data) {
          if(item.ses_id === this.currentSession.ses_id) {
            this.currentSession.ses_name = item.ses_name;
          }
        }
      }
    })
  }
  getAllStudents() {
    this.sisService.getAllStudents({login_id: this.data.au_login_id}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.studentDetails = result.data[0];
        this.defaultsrc = this.studentDetails.au_profileimage;
        if(this.studentDetails.active_parent === 'M') {
          this.studentDetails.active_parent_name = this.studentDetails.mother_name;
        } else if(this.studentDetails.active_parent === 'F') {
          this.studentDetails.active_parent_name = this.studentDetails.father_name;
        } else if(this.studentDetails.active_parent === 'G') {
          this.studentDetails.active_parent_name = this.studentDetails.guardian_name;
        }
      }
    })
  }

}
