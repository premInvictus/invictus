import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
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
  teacherSignature: any;
  usePrincipalSignature: any
  useTeacherSignature: any
  header: any;
  footer: any;
  remarksArr: any[] = [];
  hasCoscholasticSub = false;
  subjectsubexam_marks_arr: any[] = [];

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
    console.log(this.data);
    this.currentSession = JSON.parse(localStorage.getItem('session'));
    for (let i = 1; i <= this.data.param.eme_term_id; i++) {
      this.termArray.push(i);
    }
    this.getSubjectSubexamMapping();
    this.ctForClass();
    this.getGlobalSetting();
    this.getSchool();
    this.getSession();
    this.getAllStudents();
    this.getSubjectsByClass();
    this.getClassGradeset();
    //this.getExamDetails();
    //this.getGradeCardMark();

  }
  getSubjectSubexamMapping() {
    this.examService.getSubjectSubexamMapping({ssm_class_id: this.data.class_id}).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        this.subjectsubexam_marks_arr = result.data;
      }
    })
  }
  getOneSubjectSubexamMark(class_id, exam_id, se_id, sub_id) {
    for(let item of this.subjectsubexam_marks_arr) {
      if(item.ssm_class_id == class_id && item.ssm_exam_id == exam_id && item.ssm_se_id == se_id && item.ssm_sub_id == sub_id) {
        return Number(item.ssm_sub_mark);
      }
    }
    return -1;
  }
  getRemarksEntryStudent(sub_id = null) {
    const param: any = {};
    param.ere_class_id = this.data.class_id;
    param.ere_sec_id = this.data.sec_id;
    param.ere_term_id = this.data.param.eme_term_id;
    if(sub_id) {
      param.ere_sub_id = sub_id;
    }
    param.ere_remarks_type = this.data.ect_exam_type;
    param.erem_login_id = this.data.au_login_id;
    this.examService.getRemarksEntryStudent(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
        this.remarksArr = result.data;
      }
    })
  }
  remarkOfSub(sub_id = null) {
    let remarkstr = '';
    if(sub_id) {
      if(this.remarksArr.length > 0) {
        const temp = this.remarksArr.find(e => e.ere_sub_id === sub_id);
        remarkstr = temp.erem_remark;
      }
    } else {
      if(this.remarksArr.length > 0) {
        remarkstr = this.remarksArr[0].erem_remark;
      }
    }
    return remarkstr;
  }
  ctForClass() {
    const param: any = {};
    param.uc_class_teacher = '1';
    param.uc_class_id = this.data.class_id;
    param.uc_sec_id = this.data.sec_id;
    this.examService.ctForClass(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
        this.teacherSignature = result.data[0].usr_signature;
      }
    });
  }
  getGlobalSetting() {
    let param: any = {};
    param.gs_name = ['gradecard_header', 'gradecard_footer', 'gradecard_principal_signature', 'gradecard_use_principal_signature', 'gradecard_use_teacher_signature'];
    this.examService.getGlobalSetting(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.settings = result.data;
        this.settings.forEach(element => {
          if (element.gs_alias === 'gradecard_principal_signature') {
            this.principalSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_header') {
            this.header = element.gs_value;
          } else if (element.gs_alias === 'gradecard_use_principal_signature') {
            this.usePrincipalSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_use_teacher_signature') {
            this.useTeacherSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_footer') {
            this.footer = element.gs_value;
          }
        });
      }
    })
  }
  getSchool() {
    this.sisService.getSchool().subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.schoolDetails = result.data[0];
        this.defaultschoollogosrc = this.schoolDetails.school_logo;
      }
    })
  }
  public generatePDF() {
    var data = document.getElementById('gradecard');
    html2canvas(data, { logging: true, allowTaint: false, useCORS: true }).then(canvas => {
      // Few necessary setting options 

      var pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);

      var imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save('converteddoc.pdf');
    });
  }
  getClassGradeset() {
    this.examService.getClassGradeset({ class_id: this.data.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const tempGrade = result.data;
        tempGrade.forEach(element => {
          if (element.egs_point_type === '2') {
            this.GradeSet.push(element);
          } else if (element.egs_point_type === '1') {
            this.GradeSetPoint.push(element)
          }
        });
      }
    })
  }
  getCalculatedMarksSub(sub_id, exam_id, term){
    const currentSub = this.subjectArray.find(e => e.sub_id === sub_id);
    let totalscore = 0;
    if(currentSub.childSub.length > 0) {
      currentSub.childSub.forEach(element => {
        totalscore += this.getCalculatedMarks(element.sub_id, exam_id, term);
      });
      totalscore = totalscore/currentSub.childSub.length;
    } else {
      totalscore = this.getCalculatedMarks(sub_id, exam_id, term);
    }
    return Number.parseFloat(totalscore.toFixed(2));
  }
  getCalculatedMarks(sub_id, exam_id, term) {
    const curExam = this.examArray.find(e => e.exam_id === exam_id);
    const percentageArray: any[] = [];
    curExam.exam_sub_exam_max_marks.forEach(element => {
      if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0) {
        this.gradeCardMarkArray.forEach(element1 => {
          if (element1.eme_sub_id === sub_id && element1.eme_exam_id === exam_id && element1.eme_subexam_id === element.se_id && Number(element1.eme_term_id) === Number(term)) {
            let per = 0;
            let oneSubSubexamMark = this.getOneSubjectSubexamMark(this.data.class_id, exam_id, element.se_id,sub_id);
            oneSubSubexamMark = oneSubSubexamMark === -1 ? element.exam_max_marks : oneSubSubexamMark;
            if(!isNaN(element1.emem_marks)) {
              per = (element1.emem_marks / oneSubSubexamMark) * 100;
            }
            percentageArray.push({
              sub_id: sub_id,
              exam_id: exam_id,
              exam_max_marks: Number(oneSubSubexamMark),
              se_id: element.se_id,
              sexam_name: element.sexam_name,
              obtained_percentage: Number.parseFloat(per.toFixed(2)),
              obtained_marks: element1.emem_marks
            });
          }
        });
      }
    });
    console.log(percentageArray);
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
          score = (((max1 + max2) / 2) / 100) * curExam.exam_weightage;
          score = Number.parseFloat(score.toFixed(2));
          break;
        case 2:
          let sum = 0;
          for (const item of percentageArray) {
            sum += item.obtained_percentage;
          }
          score = ((sum / percentageArray.length) / 100) * curExam.exam_weightage;
          score = Number.parseFloat(score.toFixed(2));
          break;
        case 3:
          let max = percentageArray[0].obtained_percentage;
          for (const item of percentageArray) {
            if (item.obtained_percentage > max) {
              max = item.obtained_percentage;
            }
          }
          score = (max / 100) * curExam.exam_weightage;
          score = Number.parseFloat(score.toFixed(2));
          break;
      }
    }
    return score;
  }

  getPassResult(term) {
    const temp: any[] = [];
    this.gradePerTermOnScholastic.forEach(element => {
      const tindex = temp.findIndex(e => e.sub_id === element.sub_id && e.term === element.term && e.grade === element.grade);
      if (tindex === -1) {
        temp.push(element);
      }
    });
    let total = 0;
    for (const item of temp) {
      total = total + item.grade;
    }
    return Math.round(total / temp.length) > 32 ? 'Pass' : 'Fail';

  }
  calculateExamTotal() {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + Number(element.exam_weightage);
    });
    return gradeMarks;
  }
  calculateTotal(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarksSub(sub_id, element.exam_id, term);
    });
    return Number.parseFloat(gradeMarks.toFixed(2));
  }
  calculateGrade(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarksSub(sub_id, element.exam_id, term);
    });
    //const grade = Math.round(gradeMarks / this.sexamArray.length);
    const grade = Number.parseFloat(gradeMarks.toFixed(2));
    if (Number(term) === Number(this.data.param.eme_term_id)) {
      this.totalexecutedSolasticSubject++;
      this.gradePerTermOnScholastic.push({
        sub_id: sub_id,
        term: term,
        grade: grade
      });
      if (this.totalexecutedSolasticSubject === this.totalSolasticSubject) {
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
  calculateGradeCcePoint(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id, term);
    });
    const grade = Math.round(gradeMarks / this.sexamArray.length);
    if (Number(term) === Number(this.data.param.eme_term_id)) {
      this.totalexecutedSolasticSubject++;
      this.gradePerTermOnScholastic.push({
        sub_id: sub_id,
        term: term,
        grade: grade
      });
      if (this.totalexecutedSolasticSubject === this.totalSolasticSubject) {
        this.resultdivflag = true;
      }
    }
    const pointValue = this.GradeSetPoint.find(e => Number(e.egs_grade_value) === grade);
    if (pointValue) {
      return pointValue.egs_grade_name;
    }
  }
  getGradePoint(grade) {
    if (grade) {
      const pointValue = this.GradeSetPoint.find(e => Number(e.egs_grade_value) === grade);
      if (pointValue) {
        return pointValue.egs_grade_name;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }
  calculateGradePoint(sub_id, term) {
    let gradeMarks = 0;
    this.cexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id, term);
    });
    const grade = Math.round(gradeMarks / this.cexamArray.length);
    const pointValue = this.GradeSetPoint.find(e => Number(e.egs_grade_value) === grade);
    if (pointValue) {
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
        const temp: any[] = result.data;
        if(this.data.ect_exam_type === '2') {
          this.getRemarksEntryStudent();
        } else {
          console.log(temp);
          console.log(temp.map(e => e.sub_id));
          this.getRemarksEntryStudent(temp.map(e => e.sub_id));
        }
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
        this.subjectArray.forEach(element => {
          if (element.sub_type === '1') {
            this.totalSolasticSubject++;
          } else if(element.sub_type === '2') {
            this.hasCoscholasticSub = true;
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
  closeDialog(){
    this.dialogRef.close();
  }

}
