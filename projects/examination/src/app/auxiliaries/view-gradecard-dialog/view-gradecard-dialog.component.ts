import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

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
  acedemicmarks = 0;
  GradeSet: any[] = [];
  termArray: any[] = [];
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
    for (let i = 1; i <= this.data.param.eme_term_id; i++) {
      this.termArray.push(i);
    }
    this.getSession();
    this.getAllStudents();
    this.getSubjectsByClass();
    this.getClassGradeset();
    //this.getExamDetails();
    //this.getGradeCardMark();

  }
  getClassGradeset() {
    this.examService.getClassGradeset({ class_id: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.GradeSet = result.data;
      }
    })
  }
  getCalculatedMarks(sub_id, exam_id, term) {
    const curExam = this.examArray.find(e => e.exam_id === exam_id);
    const percentageArray: any[] = [];
    curExam.exam_sub_exam_max_marks.forEach(element => {
      if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0) {
        this.gradeCardMarkArray.forEach(element1 => {
          if (element1.eme_sub_id === sub_id && element1.eme_exam_id === exam_id && element1.eme_subexam_id === element.se_id && Number(element1.eme_term_id) === Number(term)) {
            const per = (element1.emem_marks / element.exam_max_marks) * 100;
            percentageArray.push({
              exam_max_marks: Number(element.exam_max_marks),
              se_id: element.se_id,
              sexam_name: element.sexam_name,
              obtained_percentage: Math.round(per),
              obtained_marks: element1.emem_marks
            });
          }
        });
      }
    });
    let score = 0;
    if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0 && percentageArray.length > 0) {
      switch (Number(curExam.exam_calculation_rule)) {
        case 1:
          let max1 = percentageArray[0].obtained_percentage;
          let max2 = percentageArray[0].obtained_percentage;
          for (const item of percentageArray) {
            if (item.obtained_percentage > max1) {
              max2 = max1;
              max1 = item.obtained_percentage;
            } else if (item.obtained_percentage > max2 && item.obtained_percentage !== max1) {
              max2 = item.obtained_percentage;
            }
          }
          score = Math.round((((max1 + max2) / 2) / 100) * curExam.exam_weightage);
          break;
        case 2:
          let sum = 0;
          for (const item of percentageArray) {
            sum += item.obtained_percentage;
          }
          score = Math.round(((sum / percentageArray.length) / 100) * curExam.exam_weightage);
          break;
        case 3:
          let max = percentageArray[0].obtained_percentage;
          for (const item of percentageArray) {
            if (item.obtained_percentage > max) {
              max = item.obtained_percentage;
            }
          }
          score = Math.round((max / 100) * curExam.exam_weightage);
          break;
      }
    }
    //console.log('sub_id', sub_id);
    //console.log('sub_id', curExam);
    //console.log('percentageArray',percentageArray);
    return score;
  }

  calculateGrade(sub_id,term) {
    let gradeMarks = 0;
    this.examArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id,term);
    });
    const grade = Math.round(gradeMarks / this.examArray.length);
    let gradeValue = '';
    for (let index = 0; index < this.GradeSet.length; index++) {
      const element = this.GradeSet[index];
      if (grade >= Number(element.egs_range_start) && grade <= Number(element.egs_range_end)) {
        gradeValue = element.egs_grade_name;
        break;
      }
    }
    return gradeValue;
  }
  pdfDownload() {
    const doc = new jsPDF();
    doc.autoTable({
      html: '#gradecard',
      useCss: true
    });
    doc.save('gradecard.pdf');
  }

  getGradeCardMark() {
    const param: any = {};
    param.class_id = this.data.param.eme_class_id;
    param.sec_id = this.data.param.eme_sec_id;
    param.eme_term_id = this.termArray;
    param.eme_review_status = '4';
    param.login_id = this.data.au_login_id;
    this.examService.getGradeCardMark(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.gradeCardMarkArray = result.data;
      }
      this.gflag = true;
    });
  }
  getExamDetails() {
    this.examArray = [];
    this.examService.getExamDetails({ exam_class: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        this.eflag = true;
        if (this.examArray.length > 0) {
          this.examArray.forEach(element => {
            this.acedemicmarks += Number(element.exam_weightage);
          });
        }
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
      if (result && result.status === 'ok') {
        for (const item of result.data) {
          if (item.ses_id === this.currentSession.ses_id) {
            this.currentSession.ses_name = item.ses_name;
          }
        }
      }
    })
  }
  getAllStudents() {
    this.sisService.getAllStudents({ login_id: this.data.au_login_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.studentDetails = result.data[0];
        this.defaultsrc = this.studentDetails.au_profileimage;
        if (this.studentDetails.active_parent === 'M') {
          this.studentDetails.active_parent_name = this.studentDetails.mother_name;
        } else if (this.studentDetails.active_parent === 'F') {
          this.studentDetails.active_parent_name = this.studentDetails.father_name;
        } else if (this.studentDetails.active_parent === 'G') {
          this.studentDetails.active_parent_name = this.studentDetails.guardian_name;
        }
      }
    })
  }

}
