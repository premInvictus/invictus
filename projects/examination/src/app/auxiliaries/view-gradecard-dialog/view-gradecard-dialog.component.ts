import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-gradecard-dialog',
  templateUrl: './view-gradecard-dialog.component.html',
  styleUrls: ['./view-gradecard-dialog.component.css']
})
export class ViewGradecardDialogComponent implements OnInit {

  studentDetails: any;
  currentSession: any;
  defaultsrc: any = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
  defaultschoollogosrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDfHehrJZBsRnceQ7ZnsweW0APVykYhToalBr9WF-2zd4JC0QbFA";
  subjectArray: any[] = [];
  examArray: any[] = [];
  sexamArray: any[] = [];
  cexamArray: any[] = [];
  gradeCardMarkArray: any[] = [];
  sflag = false;
  eflag = false;
  gflag = false;
  acedemicmarks = 0;
  GradeSet: any[] = [];
  GradeSetPoint: any[] = [];
  termArray: any[] = [];
  schoolDetails: any;
  gradePerTermOnScholastic: any[] = [];
  totalSolasticSubject = 0;
  totalexecutedSolasticSubject = 0;
  today = new Date();
  resultdivflag = false;
  settings: any[] = [];
  principalSignature: any;
  header: any;

  constructor(
    public dialogRef: MatDialogRef<ViewGradecardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.currentSession = JSON.parse(localStorage.getItem('session'));
    for (let i = 1; i <= this.data.param.eme_term_id; i++) {
      this.termArray.push(i);
    }
    this.getGlobalSetting();
    this.getSchool();
    this.getSession();
    this.getAllStudents();
    this.getSubjectsByClass();
    this.getClassGradeset();
    //this.getExamDetails();
    //this.getGradeCardMark();

  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_name = ['gradecard_header','gradecard_footer','gradecard_principal_signature'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.settings = result.data;
        this.settings.forEach(element => {
          if(element.gs_alias === 'gradecard_principal_signature') {
            this.principalSignature = element.gs_value;
          } else if(element.gs_alias === 'gradecard_header') {
            this.header = element.gs_value;
          }
        });
      }
    })
  }
  getSchool() {
    this.sisService.getSchool().subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.schoolDetails = result.data[0];
        this.defaultschoollogosrc = this.schoolDetails.school_logo;
      }
    })
  }
  public generatePDF() {
    var data = document.getElementById('gradecard');
    html2canvas(data, { logging: true , allowTaint: false , useCORS: true }).then(canvas => {
      // Few necessary setting options 

      var pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);

      var imgData  = canvas.toDataURL("image/png");
      pdf.addImage(imgData,0,0,canvas.width, canvas.height);
      pdf.save('converteddoc.pdf');
    });
  }
  getClassGradeset() {
    this.examService.getClassGradeset({ class_id: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const tempGrade = result.data;
        tempGrade.forEach(element => {
          if(element.egs_point_type === '2') {
            this.GradeSet.push(element);
          } else if(element.egs_point_type === '1') {
            this.GradeSetPoint.push(element)
          }
        });
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
    return score;
  }

  getPassResult(term){
    const temp: any[] = [];
    this.gradePerTermOnScholastic.forEach(element => {
      const tindex = temp.findIndex(e => e.sub_id === element.sub_id && e.term === element.term && e.grade === element.grade);
      if(tindex === -1) {
        temp.push(element);
      }
    });
    let total = 0;
    for(const item of temp) {
      total = total + item.grade;
    }
    return Math.round(total/temp.length) > 32 ? 'Pass' : 'Fail';

  }
  calculateGrade(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id, term);
    });
    const grade = Math.round(gradeMarks / this.sexamArray.length);
    if(Number(term) === Number(this.data.param.eme_term_id)) {
      this.totalexecutedSolasticSubject++;
      this.gradePerTermOnScholastic.push({
        sub_id: sub_id,
        term: term,
        grade: grade
      });
      if(this.totalexecutedSolasticSubject === this.totalSolasticSubject) {
        this.resultdivflag = true;
      }
    }
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
  calculateGradePoint(sub_id, term) {
    let gradeMarks = 0;
    this.cexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id, term);
    });
    const grade = Math.round(gradeMarks / this.cexamArray.length);
    const pointValue = this.GradeSetPoint.find(e => Number(e.egs_grade_value) === grade);  
    if(pointValue)   {
      return pointValue.egs_grade_name;
    }
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
    this.sexamArray = [];
    this.examService.getExamDetails({ exam_class: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        this.examArray.forEach(element => {
          if (element.exam_category === '1') {
            this.sexamArray.push(element);
          } else {
            this.cexamArray.push(element);
          }
        });
        this.eflag = true;
        if (this.sexamArray.length > 0) {
          this.sexamArray.forEach(element => {
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
        this.subjectArray.forEach(element => {
          if(element.sub_type === '1') {
            this.totalSolasticSubject++;
          }
        });
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
