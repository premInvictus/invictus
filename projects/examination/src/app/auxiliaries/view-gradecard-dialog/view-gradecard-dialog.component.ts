import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SisService, SmartService, CommonAPIService, ExamService } from '../../_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-view-gradecard-dialog',
  templateUrl: './view-gradecard-dialog.component.html',
  styleUrls: ['./view-gradecard-dialog.component.css']
})
export class ViewGradecardDialogComponent implements OnInit {

  roundOff = false;

  studentDetails: any;
  currentSession: any;
  defaultsrc: any = "https://apisis.invictusdigisoft.com/createonfly.php?src=https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png&h=50&w=50";
  defaultschoollogosrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDfHehrJZBsRnceQ7ZnsweW0APVykYhToalBr9WF-2zd4JC0QbFA";
  subjectArray: any[] = [];
  examArray: any[] = [];
  sexamArray: any[] = [];
  cexamArray: any[] = [];
  isPreparingCard: Boolean = true;
  gradeCardMarkArray: any[] = [];
  sflag = false;
  eflag = false;
  gflag = false;
  term_id: any;
  class_id: any;
  sec_id: any;
  acedemicmarks = 0;
  GradeSet: any[] = [];
  GradeSet_b: any[] = [];
  GradeSetPoint: any[] = [];
  GradeSetPoint_b: any[] = [];
  termArray: any[] = [];
  schoolDetails: any;
  gradePerTermOnScholastic: any[] = [];
  totalSolasticSubject = 0;
  totalexecutedSolasticSubject = 0;
  today = new Date();
  resultdivflag = false;
  settings: any[] = [];
  principalSignature: any;
  hodSignature: any;
  teacherSignature: any;
  usePrincipalSignature: any
  useHodSignature: any
  useTeacherSignature: any
  header: any;
  footer: any;
  remarksArr: any[] = [];
  hasCoscholasticSub = false;
  subjectsubexam_marks_arr: any[] = [];
  classHighestArr: any[] = [];
  totalworkingdays = 0;
  totalpresentday = 0;
  attendenceInPercent = 0;
  obtainedGradeAvgHighestCount = 0;
  showHealthStatus = false;
  showdeclarationdate = false;
  obtainedGradeAvgHighest = {
    obtained: true,
    grade: false,
    avg: false,
    highest: false,
    remark: false,
    subjectwise_bifurcation: false,
    scholastic_b_grade: false,
    scholastic_b_gradeset: ''
  };
  exambifurcateCount = 0;
  classtermdate: any;
  dateofdeclaration: any;
  userachivement: any;
  isuserachivement: string;
  gradingSystem: string = '';
  resultRemarksArr: any[] = [];
  printData: any = {};
  printDataFlag = false;
  all_term_subject_total_mark = 0;
  all_term_student_total_mark = 0;
  all_term_student_total_percentage = 0;
  gradecard_attendance: any;
  gradecard_total_mettings: any;
  gradecard_mettings_present: any;
  gradecard_show_scholastic_gradescale: any;
  gradecard_scholastic_abbreviation: any;
  showLoadingFlag = false;
  constructor(
    public dialogRef: MatDialogRef<ViewGradecardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    private sanitizer: DomSanitizer
  ) {
    this.commonAPIService.showLoading.subscribe((flag: boolean) => {
      this.showLoadingFlag = flag;
    });
  }

  ngOnInit() {
    this.printGradecard();
    this.dateofdeclaration = new Date();
    console.log(this.data);
    this.class_id = this.data.param.eme_class_id;
    this.sec_id = this.data.param.eme_sec_id;
    this.term_id = this.data.param.eme_term_id;
    if (this.data.param.eme_exam_id) {
      this.obtainedGradeAvgHighest.obtained = false;
    }
    if (this.data.ect_grade_avg_highest && this.data.ect_grade_avg_highest != '') {
      let obj = JSON.parse(this.data.ect_grade_avg_highest);
      //console.log('obj.avg', obj.avg);
      if (obj.grade && obj.grade == true) {
        this.obtainedGradeAvgHighest.grade = true;
      }
      if (obj.avg && obj.avg == true) {
        this.obtainedGradeAvgHighest.avg = true;
      }
      if (obj.highest && obj.highest == true) {
        this.obtainedGradeAvgHighest.highest = true;
      }
      if (obj.remark && obj.remark == true) {
        this.obtainedGradeAvgHighest.remark = true;
      }
      if (obj.subjectwise_bifurcation && obj.subjectwise_bifurcation == true) {
        this.obtainedGradeAvgHighest.subjectwise_bifurcation = true;
      }
      if (obj.scholastic_b_grade && obj.scholastic_b_grade == true) {
        this.obtainedGradeAvgHighest.scholastic_b_grade = true;
        this.obtainedGradeAvgHighest.scholastic_b_gradeset = obj.scholastic_b_gradeset

      }
    }
    if (this.data.param.eme_subexam_id.length > 0) {
      this.obtainedGradeAvgHighest.obtained = false;
      this.obtainedGradeAvgHighest.grade = false;
      this.obtainedGradeAvgHighest.avg = false;
      this.obtainedGradeAvgHighest.highest = false;

    }
    if (this.data.param.eme_term_id === 'comulative') {
      this.obtainedGradeAvgHighest.obtained = true;
      this.obtainedGradeAvgHighest.grade = false;
      this.obtainedGradeAvgHighest.avg = false;
      this.obtainedGradeAvgHighest.highest = false;
    }
    this.currentSession = JSON.parse(localStorage.getItem('session'));
    this.termArray.push(this.getTermid());
    this.ctForClass();
    this.getGlobalSetting();
    this.getSchool();
    this.getSession();
    this.getAllStudents();
    this.getStudentSubjects();
    //this.getTermWorkingAndHoliday();
    this.getClassGradeset();
    //this.getExamDetails();
    //this.getGradeCardMark(); 
    this.getClassTermDate();
    console.log('this.obtainedGradeAvgHighest----', this.obtainedGradeAvgHighest);


  }
  getTermid() {
    if (this.data.param.eme_term_id == 'comulative') {
      return this.data.last_term_id;
    } else if (this.data.param.eme_term_id == 'percumulative') {
      return '1';
    } else {
      return this.data.param.eme_term_id;
    }
  }
  printGradecard(item = null) {
    const param: any = {};
    param.login_id = [this.data.au_login_id];
    param.class_id = this.data.param.eme_class_id;
    param.sec_id = this.data.param.eme_sec_id;
    param.term_id = this.data.param.eme_term_id;
    param.exam_id = this.data.param.eme_exam_id;
    param.se_id = this.data.param.eme_subexam_id;
    param.view = '1';
    console.log("printGradecard ok");
    // this.examService.printGradecard(param).subscribe((result: any) => {
    //   console.log("params", param);
    //   if (result && result.status === 'ok') {
    //     this.printData = result.data;
    //     console.log("printGradecard", this.printData);
    //     this.printData.so_printData.forEach(element => {
    //       this.all_term_subject_total_mark += element.term_subject_total_mark['A'];
    //       this.all_term_student_total_mark += element.term_student_total_mark['A'];
    //     });
    //     this.all_term_student_total_percentage = this.getTwoDecimalValue(this.all_term_student_total_mark / this.all_term_subject_total_mark * 100);
    //     this.printDataFlag = true;
    //   }
    // })
    this.examService.printGradecard(param).subscribe(
      (response: any) => {
        this.showLoadingFlag = true;
        if (response && response.status === 'ok') {
          this.printData = response.data;
          console.log("printGradecard", this.printData);
          this.printData.so_printData.forEach(element => {
            this.all_term_subject_total_mark += element.term_subject_total_mark['A'];
            this.all_term_student_total_mark += element.term_student_total_mark['A'];
          });
          if(this.roundOff) this.all_term_student_total_mark = Math.ceil(this.all_term_student_total_mark);
          this.all_term_student_total_percentage = this.getTwoDecimalValue(this.all_term_student_total_mark / this.all_term_subject_total_mark * 100);
        }
      },
      err => {
        console.log(err);
        console.log("error prepared grade card");
        this.isPreparingCard = false;
        this.showLoadingFlag = false;
      },
      () => {
        console.log("prepared grade card");
        this.isPreparingCard = false;
        this.printDataFlag = true;
        this.showLoadingFlag = false;
      }
    )

  }
  getClassTermDate() {
    this.classtermdate = {};
    const param: any = {};
    param.etd_term = this.getTermid();
    param.etd_class_id = this.data.param.eme_class_id;
    param.etd_status = '1';
    this.examService.getClassTermDate(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.classtermdate = result.data[0];
        if (this.classtermdate.etd_declaration_date) {
          this.dateofdeclaration = new Date(this.classtermdate.etd_declaration_date);
        }
      }
    })
  }
  getTermStudentAttendence2() {
    const param: any = {};
    param.au_login_id = this.data.au_login_id;
    if (this.data.param.eme_term_id == 'comulative') {
      const termsarr: any[] = [];
      for (let index = 1; index <= this.getTermid(); index++) {
        termsarr.push(index);
      }
      param.term_id = termsarr;
    } else {
      param.term_id = this.getTermid();
    }
    param.class_id = this.data.param.eme_class_id;
    param.sec_id = this.data.param.eme_sec_id;

    if (this.data.param.eme_exam_id) {
      param.exam_id = this.data.param.eme_exam_id;
    }
    if (this.data.param.eme_subexam_id) {
      param.subexam_id = this.data.param.eme_subexam_id;
    }

    this.examService.getTermStudentAttendence2(param).subscribe((result1: any) => {
      //console.log(result1);
      if (result1 && result1.status === 'ok') {
        if (this.data.param.eme_term_id != 'comulative') {
          const termAttendence = result1.data[0];
          this.totalpresentday = Number(termAttendence['mta_present_days']);
          this.totalworkingdays = Number(termAttendence['mta_overall_attendance']);
          this.attendenceInPercent = this.getTwoDecimalValue(this.totalpresentday / this.totalworkingdays * 100);
        } else {
          const termAttendence = result1.data;
          termAttendence.forEach(element => {
            this.totalpresentday += Number(element['mta_present_days'])
            this.totalworkingdays += Number(element['mta_overall_attendance']);
          });
          this.attendenceInPercent = this.totalworkingdays > 0 ? this.getTwoDecimalValue(this.totalpresentday / this.totalworkingdays * 100) : 0;
        }
      }
    })
  }
  getTermWorkingAndHoliday() {
    const param: any = {};
    param.class_id = this.data.class_id;
    param.term_id = this.getTermid();
    this.examService.getTermWorkingAndHoliday(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const termholidays = result.data;
        this.totalworkingdays = termholidays.betweendays.length - Object.keys(termholidays.holidaysunday).length;
        const param: any = {};
        param.from = termholidays.termStart;
        param.to = termholidays.termEnd;
        param.au_login_id = this.data.au_login_id;
        this.examService.getTermStudentAttendence(param).subscribe((result1: any) => {
          if (result1 && result1.status === 'ok') {
            const termAttendence = result1.data;
            this.totalpresentday = termAttendence.length;
            this.attendenceInPercent = this.getTwoDecimalValue(this.totalpresentday / this.totalworkingdays * 100);
          }
        })
      }
    })
  }
  getOneSubjectSubexamMark(class_id, exam_id, se_id, sub_id) {
    for (let item of this.subjectsubexam_marks_arr) {
      if (item.ssm_class_id == class_id && item.ssm_exam_id == exam_id && item.ssm_se_id == se_id && item.ssm_sub_id == sub_id) {
        return Number(item.ssm_sub_mark);
      }
    }
    return -1;
  }
  getRemarksEntryStudent(sub_id = null) {
    const param: any = {};
    param.ere_class_id = this.data.class_id;
    param.ere_sec_id = this.data.sec_id;
    param.ere_term_id = this.getTermid();
    param.ere_remarks_type = this.data.ect_exam_type;
    if (sub_id) {
      if (!this.obtainedGradeAvgHighest.remark) {
        param.ere_remarks_type = '2';
      } else {
        param.ere_sub_id = sub_id;
      }
    }
    if (this.data.param.eme_exam_id) {
      param.ere_exam_id = this.data.param.eme_exam_id;
    }
    if (this.data.param.eme_subexam_id) {
      param.ere_sub_exam_id = this.data.param.eme_subexam_id;
    }
    param.erem_login_id = this.data.au_login_id;
    this.examService.getRemarksEntryStudent(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
        this.remarksArr = result.data;
        this.resultdivflag = true;
      }
    })
  }
  getResultEntryStudent() {

    const param: any = {};
    param.ere_class_id = this.data.class_id;
    param.ere_sec_id = this.data.sec_id;
    param.ere_term_id = this.getTermid();
    param.ere_remarks_type = '3';
    if (this.studentDetails) {
      param.erem_login_id = this.studentDetails.au_login_id;
    }

    if (this.data.param.eme_exam_id) {
      param.ere_exam_id = this.data.param.eme_exam_id;
    }
    if (this.data.param.eme_subexam_id) {
      param.ere_sub_exam_id = this.data.param.eme_subexam_id;
    }

    console.log('param--', param);
    this.examService.getRemarksEntryStudent(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        //console.log(result.data);
        this.resultRemarksArr = result.data;
        this.resultdivflag = true;
      }
    })
  }
  remarkOfSub(sub_id = null) {
    let remarkstr = '';
    //console.log('remarksArr', this.remarksArr);
    if (sub_id) {
      if (this.remarksArr.length > 0) {
        const temp = this.remarksArr.find(e => e.ere_sub_id === sub_id);
        remarkstr = temp.erem_remark;
      }
    } else {
      if (this.remarksArr.length > 0) {
        remarkstr = this.remarksArr[0].erem_remark;
      }
    }
    return remarkstr;
  }
  remarkOfResult(au_login_id) {
    let remarkstr = '';
    if (au_login_id) {
      if (this.resultRemarksArr.length > 0) {
        const temp = this.resultRemarksArr.find(e => e.erem_login_id === au_login_id);
        remarkstr = temp.erem_remark;
      }
    } else {
      if (this.remarksArr.length > 0) {
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
    param.gs_alias = ['gradecard_scholastic_abbreviation', 'gradecard_show_scholastic_gradescale', 'gradecard_attendance', 'gradecard_total_mettings', 'gradecard_mettings_present', 'gradecard_header', 'gradecard_footer', 'gradecard_principal_signature', 'gradecard_use_principal_signature', 'gradecard_use_hod_signature', 'gradecard_hod_signature', 'gradecard_use_teacher_signature', 'school_attendance_theme',
      'gradecard_health_status', 'gradecard_date', 'school_achievement'];
    this.examService.getGlobalSettingReplace(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.settings = result.data;
        this.settings.forEach(element => {
          if (element.gs_alias === 'gradecard_principal_signature') {
            this.principalSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_hod_signature') {
            this.hodSignature = element.gs_value;
          }
          else if (element.gs_alias === 'gradecard_header') {
            this.header = element.gs_value;
            this.header = this.header.replace('@', 'data:image/png;base64,');
            // var regex = /<img.*?src="(.*?)"/;
            // var src = regex.exec(this.header)[1];
            // console.log(src);
          } else if (element.gs_alias === 'gradecard_health_status') {
            const temp_arr = element.gs_value.split(',');
            this.showHealthStatus = false;
            if (temp_arr.length > 0) {
              temp_arr.forEach(element => {
                if (Number(element) === Number(this.data.class_id)) {
                  this.showHealthStatus = true;
                }
              });
            }
          } else if (element.gs_alias === 'gradecard_date') {
            if (Number(element.gs_value) === 1) {
              this.showdeclarationdate = true;
            } else {
              this.showdeclarationdate = false;
            }
          } else if (element.gs_alias === 'gradecard_use_principal_signature') {
            this.usePrincipalSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_use_hod_signature') {
            this.useHodSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_use_teacher_signature') {
            this.useTeacherSignature = element.gs_value;
          } else if (element.gs_alias === 'gradecard_footer') {
            this.footer = element.gs_value;
          } else if (element.gs_alias === 'school_attendance_theme') {
            if (element.gs_value == '' || element.gs_value == '0') {
              this.getTermWorkingAndHoliday();
            } else {
              this.getTermStudentAttendence2();
            }
          } else if (element.gs_alias === 'school_achievement') {
            if (element.gs_value == '1') {
              this.isuserachivement = element.gs_value;
              this.getUserAchievement();
            }
          } else if (element.gs_alias === 'gradecard_attendance') {
            this.gradecard_attendance = element.gs_value;
          } else if (element.gs_alias === 'gradecard_total_mettings') {
            this.gradecard_total_mettings = element.gs_value;
          } else if (element.gs_alias === 'gradecard_mettings_present') {
            this.gradecard_mettings_present = element.gs_value;
          } else if (element.gs_alias === 'gradecard_scholastic_abbreviation') {
            this.gradecard_scholastic_abbreviation = element.gs_value;
          } else if (element.gs_alias === 'gradecard_show_scholastic_gradescale') {
            this.gradecard_show_scholastic_gradescale = element.gs_value;
          }
        });
      }
    })
  }
  getUserAchievement() {
    const param: any = {};
    param.au_class_id = this.data.param.eme_class_id;
    param.au_term_id = this.getTermid();
    param.au_login_id = this.data.au_login_id;
    this.examService.getUserAchievement(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.userachivement = result.data[0];
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
        console.log('tempGrade--', tempGrade)

        tempGrade.forEach(element => {
          if (element.ect_gradeset_id === element.egs_number) {
            this.gradingSystem = element.egs_name;
            this.GradeSet.push(element);
          } else if (element.ect_co_gradeset_id === element.egs_number) {
            //this.gradingSystem = element.egs_name;
            this.GradeSetPoint.push(element)
          } else if (element.ect_gradeset_id_b === element.egs_number) {
            this.GradeSet_b.push(element);
          } else if (element.ect_co_gradeset_id_b === element.egs_number) {
            this.GradeSetPoint_b.push(element)
          }
        });

        // console.log('this.GradeSet a--', this.GradeSet);
        // console.log('this.coGradeSet a--', this.GradeSetPoint);
        // console.log('this.GradeSet b--', this.GradeSet_b);
        // console.log('this.coGradeSet b--', this.GradeSetPoint_b);
      }
    })
  }

  getMaxMarksSub(sub_id, exam_id, term) {

  }

  getCalculatedMarksSubsubject(sub_id, exam_id, term, subsubject_id) {
    //console.log('this.subjectArray',this.subjectArray);
    const currentSub = this.subjectArray.find(e => e.sub_id === sub_id);
    let totalscore = 0;
    let child_count_except_0 = 0;
    for (let index = 0; index < currentSub.childSub.length; index++) {
      let isSelected = true;
      const element = currentSub.childSub[index];
      const curExam = this.examArray.find(e => e.exam_id === exam_id);
      curExam.exam_sub_exam_max_marks.forEach(subexam => {
        if (this.getOneSubjectSubexamMark(this.data.param.eme_class_id, exam_id, subexam.se_id, element.sub_id) <= 0) {
          isSelected = false;
        }
      });
      if (isSelected) {
        child_count_except_0 = child_count_except_0 + 1;
      }
    }
    totalscore = this.getCalculatedMarks(subsubject_id, exam_id, term);
    return this.getTwoDecimalValue(totalscore / child_count_except_0);
  }
  getCalculatedMarksSub(sub_id, exam_id, term) {
    //console.log('this.subjectArray',this.subjectArray);
    const currentSub = this.subjectArray.find(e => e.sub_id === sub_id);
    let totalscore = 0;
    if (currentSub.childSub.length > 0) {
      currentSub.childSub.forEach(element => {
        totalscore += this.getCalculatedMarks(element.sub_id, exam_id, term);
      });
      let child_count_except_0 = 0;
      for (let index = 0; index < currentSub.childSub.length; index++) {
        let isSelected = true;
        const element = currentSub.childSub[index];
        const curExam = this.examArray.find(e => e.exam_id === exam_id);
        curExam.exam_sub_exam_max_marks.forEach(subexam => {
          if (this.getOneSubjectSubexamMark(this.data.param.eme_class_id, exam_id, subexam.se_id, element.sub_id) <= 0) {
            isSelected = false;
          }
        });
        if (isSelected) {
          child_count_except_0 = child_count_except_0 + 1;
        }
      }
      totalscore = totalscore / child_count_except_0;
    } else {
      totalscore = this.getCalculatedMarks(sub_id, exam_id, term);
    }
    return this.getTwoDecimalValue(totalscore);
  }
  getCalculatedMarksSubSubexam(sub_id, exam_id, term, se_id) {
    //console.log('this.subjectArray',this.subjectArray);
    const currentSub = this.subjectArray.find(e => e.sub_id === sub_id);
    let totalscore = 0;
    if (currentSub.childSub.length > 0) {
      currentSub.childSub.forEach(element => {
        totalscore += this.getCalculatedMarksSubexam(element.sub_id, exam_id, term, se_id);
      });
      //totalscore = totalscore / currentSub.childSub.length;
    } else {
      totalscore = this.getCalculatedMarksSubexam(sub_id, exam_id, term, se_id);
    }
    console.log('totalscore  ----------', totalscore);
    return this.getTwoDecimalValue(Number(totalscore));
  }
  getCalculatedMarksSubexam(sub_id, exam_id, term, se_id) {
    console.log('gradeCardMarkArray----------------', this.gradeCardMarkArray);
    let emem_marks = 0;
    if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0) {
      this.gradeCardMarkArray.forEach(element1 => {
        if (element1.eme_sub_id === sub_id && element1.eme_exam_id === exam_id && element1.eme_subexam_id === se_id && Number(element1.eme_term_id) === Number(term)) {
          if (!isNaN(element1.emem_marks)) {
            emem_marks = Number(element1.emem_marks);
          }
        }
      });
    }
    return emem_marks;
  }
  getCalculatedMarks(sub_id, exam_id, term) {
    const curExam = this.examArray.find(e => e.exam_id === exam_id);
    console.log('curExam----------------', curExam);
    const percentageArray: any[] = [];
    curExam.exam_sub_exam_max_marks.forEach(element => {
      if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0) {
        this.gradeCardMarkArray.forEach(element1 => {
          if (element1.eme_sub_id === sub_id && element1.eme_exam_id === exam_id && element1.eme_subexam_id === element.se_id && Number(element1.eme_term_id) === Number(term)) {
            let per = 0;
            let oneSubSubexamMark = this.getOneSubjectSubexamMark(this.data.class_id, exam_id, element.se_id, sub_id);
            oneSubSubexamMark = oneSubSubexamMark === -1 ? element.exam_max_marks : oneSubSubexamMark;
            if (!isNaN(element1.emem_marks)) {
              per = (element1.emem_marks / oneSubSubexamMark) * 100;
            }
            percentageArray.push({
              sub_id: sub_id,
              exam_id: exam_id,
              exam_max_marks: Number(oneSubSubexamMark),
              se_id: element.se_id,
              sexam_name: element.sexam_name,
              obtained_percentage: this.getTwoDecimalValue(per),
              obtained_marks: element1.emem_marks
            });
          }
        });
      }
    });
    console.log('percentageArray', percentageArray);
    let score = 0;
    if (this.gradeCardMarkArray && this.gradeCardMarkArray.length > 0 && percentageArray.length > 0) {
      //console.log(percentageArray);
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
          score = this.getTwoDecimalValue(score);
          break;
        case 2:
          let sum = 0;
          for (const item of percentageArray) {
            sum += item.obtained_percentage;
          }
          score = ((sum / percentageArray.length) / 100) * curExam.exam_weightage;
          score = this.getTwoDecimalValue(score);
          break;
        case 3:
          let max = percentageArray[0].obtained_percentage;
          for (const item of percentageArray) {
            if (item.obtained_percentage > max) {
              max = item.obtained_percentage;
            }
          }
          score = (max / 100) * curExam.exam_weightage;
          score = this.getTwoDecimalValue(score);
          break;
      }
    }
    return score;
  }

  getTwoDecimalValue(value) {
    if (value && value != 0) {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return value;
    }

  }
  getPassResult(term) {
    let temp: any[] = [];
    this.gradePerTermOnScholastic.forEach(element => {
      const tindex = temp.findIndex(e => e.sub_id === element.sub_id && Number(e.term) === Number(element.term) && e.grade === element.grade && Number(element.term) === Number(term));
      if (tindex === -1) {
        temp.push(element);
      }
    });
    let total = 0;
    let totalmainsubject = 0;
    temp = temp.filter((thing, index, self) => {
      const _thing = JSON.stringify(thing);
      return index === self.findIndex((t) => {
        return JSON.stringify(t) === _thing
      })
    })
    //console.log('this.gradePerTermOnScholastic', this.gradePerTermOnScholastic);
    //console.log('term temp', temp);
    //console.log('this.subjectArray', this.subjectArray);
    for (const item of temp) {
      if (Number(item.term) === Number(term)) {
        const currentSub = this.subjectArray.find(e => e.sub_id === item.sub_id);
        if (currentSub.ess_additional === '0' && currentSub.sub_parent_id === '0' && currentSub.sub_type === '1' && currentSub.sub_category === 'A') {
          total = total + item.grade;
          totalmainsubject++;
        }
      }
    }
    //console.log('total',total);
    //console.log('totalmainsubject',totalmainsubject);
    //console.log('total percentage',total / totalmainsubject);
    if (this.GradeSet.length > 0) {
      let min = Number(this.GradeSet[0]['egs_range_end']);
      for (let index = 0; index < this.GradeSet.length; index++) {
        const element = this.GradeSet[index];
        if (Number(element.egs_range_end) < min) {
          min = Number(element.egs_range_end);
        }
      }
      return this.getTwoDecimalValue(total / totalmainsubject) > min ? 'Pass' : 'Fail';
    }
    return '';

  }
  getPassTotalPercentage(term, sub_category = 'A') {
    let temp: any[] = [];
    //console.log('this.gradePerTermOnScholastic', this.gradePerTermOnScholastic);
    this.gradePerTermOnScholastic.forEach(element => {
      const tindex = temp.findIndex(e => e.sub_id === element.sub_id && Number(e.term) === Number(element.term) && e.grade === element.grade && Number(element.term) === Number(term));
      if (tindex === -1) {
        temp.push(element);
      }
    });
    let total = 0;
    let totalmainsubject = 0;
    temp = temp.filter((thing, index, self) => {
      const _thing = JSON.stringify(thing);
      return index === self.findIndex((t) => {
        return JSON.stringify(t) === _thing
      })
    })
    //console.log('this.gradePerTermOnScholastic', this.gradePerTermOnScholastic);
    //console.log('term temp', temp);
    for (const item of temp) {
      if (item.term === term) {
        const currentSub = this.subjectArray.find(e => e.sub_id === item.sub_id);
        if (currentSub.ess_additional === '0' && currentSub.sub_parent_id === '0' && currentSub.sub_type === '1' && currentSub.sub_category == sub_category) {
          total = total + item.grade;
          totalmainsubject++;
        }
      }
    }
    return this.getTwoDecimalValue(total / totalmainsubject);

  }
  getTotalMainSubject(sub_category = 'A') {
    let totalmainsubject = 0;
    console.log('in getTotalMainSubject subjectArray', this.subjectArray)
    this.subjectArray.forEach(e => {
      if (e.ess_additional === '0' && e.sub_parent_id === '0' && e.sub_type === '1' && e.sub_category === sub_category) {
        totalmainsubject++;
      }
    })
    return totalmainsubject;
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
    return this.getTwoDecimalValue(gradeMarks);
  }

  calculateGrade(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarksSub(sub_id, element.exam_id, term);
    });
    //const grade = Math.round(gradeMarks / this.sexamArray.length);
    const grade = this.getTwoDecimalValue(gradeMarks);
    const gradePercentage = this.getTwoDecimalValue((gradeMarks / this.acedemicmarks) * 100);
    if (Number(term) <= Number(this.getTermid())) {
      this.totalexecutedSolasticSubject++;
      this.gradePerTermOnScholastic.push({
        sub_id: sub_id,
        term: term,
        grade: grade,
        gradePercentage: gradePercentage
      });
      if (this.totalexecutedSolasticSubject === this.totalSolasticSubject) {
        this.resultdivflag = true;
      }
    }
    let gradeValue = '';
    for (let index = 0; index < this.GradeSet.length; index++) {
      const element = this.GradeSet[index];
      if (gradePercentage >= parseInt(element.egs_range_start, 10) && parseInt(grade) <= parseInt(element.egs_range_end, 10)) {
        gradeValue = element.egs_grade_name;
        break;
      }
    }
    console.log(gradeValue);
    return gradeValue;
  }
  getSubjectPassResult(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarksSub(sub_id, element.exam_id, term);
    });
    //const grade = Math.round(gradeMarks / this.sexamArray.length);
    const grade = this.getTwoDecimalValue(gradeMarks);
    const gradePercentage = this.getTwoDecimalValue((gradeMarks / this.acedemicmarks) * 100);
    if (Number(term) <= Number(this.getTermid())) {
      this.totalexecutedSolasticSubject++;
      this.gradePerTermOnScholastic.push({
        sub_id: sub_id,
        term: term,
        grade: grade,
        gradePercentage: gradePercentage
      });
      if (this.totalexecutedSolasticSubject === this.totalSolasticSubject) {
        this.resultdivflag = true;
      }
    }
    if (this.GradeSet.length > 0) {
      let min = Number(this.GradeSet[0]['egs_range_end']);
      for (let index = 0; index < this.GradeSet.length; index++) {
        const element = this.GradeSet[index];
        if (Number(element.egs_range_end) < min) {
          min = Number(element.egs_range_end);
        }
      }
      return gradePercentage > min ? '' : '(F)';
    }
    return '';
  }
  calculateGradeCcePoint(sub_id, term) {
    let gradeMarks = 0;
    this.sexamArray.forEach(element => {
      gradeMarks = gradeMarks + this.getCalculatedMarks(sub_id, element.exam_id, term);
    });
    const grade = Math.round(gradeMarks / this.sexamArray.length);
    if (Number(term) === Number(this.getTermid())) {
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
    console.log('cexamArray--', this.cexamArray, sub_id, term);
    console.log('gradeMarks--', gradeMarks);
    console.log('this.GradeSetPoint-', this.GradeSetPoint);
    console.log('gradeMarks,grade,pointValue', gradeMarks, grade + '-' + pointValue);
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
        this.roundOff = this.gradeCardMarkArray[0]['roundOff'];
      }
      this.gflag = true;
    });
  }
  getExambirfurcateColspan(element) {
    if (element.exam_bifurcate.bifurcated_marks) {
      return 2;
    } else {
      return 1;
    }
  }
  getExamDetails() {
    this.sexamArray = [];
    const param: any = {};
    if (this.data.param.eme_exam_id) {
      param.exam_id = this.data.param.eme_exam_id;
    }
    if (this.data.param.eme_class_id) {
      param.exam_class = this.data.param.eme_class_id;
    }
    if (this.data.param.eme_class_id) {
      param.term_id = this.getTermid();
    }
    this.examService.getExamDetails(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.examArray = result.data;
        if (this.data.param.eme_subexam_id && this.data.param.eme_subexam_id.length > 0) {
          const curExam = this.examArray.find(e => e.exam_id === this.data.param.eme_exam_id);
          const curExamSubExam: any[] = [];
          curExam.exam_sub_exam_max_marks.forEach(element => {
            const subindex = this.data.param.eme_subexam_id.findIndex(e => e === element.se_id);
            if (subindex !== -1) {
              curExamSubExam.push(element)
            }
          });
          curExam.exam_sub_exam_max_marks = curExamSubExam;
        }
        this.examArray.forEach(element => {
          if (element.eac_type === '1') {
            // this.sexamArray[element.eac_category].push(element);
            if (this.sexamArray[element.eac_category]) {
              this.sexamArray[element.eac_category].push(element);
            }
            if (element.exam_bifurcate.bifurcated_marks) {
              this.exambifurcateCount += 1;
            }
          } else {
            this.cexamArray[element.eac_category].push(element);
          }
        });
        this.eflag = true;
        if (this.sexamArray.length > 0) {
          this.sexamArray.forEach(element => {
            this.acedemicmarks += Number(element.exam_weightage);
          });
        }
        console.log('sexamArray-------', this.sexamArray);
        console.log('examArray-------', this.examArray);
        this.getGradeCardMark();
      } else {
        // this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
      }
    });
  }
  getSubjectTypeAndCategoryStatus(type, category, arr) {
    if (arr.length > 0) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.sub_type == type && element.eac_category == category) {
          return true;
        }

      }
    }
    return false;
  }
  getStudentSubjects() {
    this.subjectArray = [];
    this.examService.getStudentSubjects({ au_login_id: this.data.au_login_id, sub_isexam: '1' }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        const temp: any[] = result.data;
        if (this.data.ect_exam_type === '2') {
          this.getRemarksEntryStudent();
        } else {
          this.getRemarksEntryStudent(temp.map(e => e.sub_id));
        }
        if (temp.length > 0) {
          temp.forEach(element => {
            if (element.sub_parent_id && element.sub_parent_id === '0' && element.eac_category) {
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
          if (element.sub_type === '1' && element.eac_category === 'A') {
            this.totalSolasticSubject++;
          } else if (element.sub_type === '2') {
            this.hasCoscholasticSub = true;
          }
        });
        this.sflag = true;
        console.log('this.subjectArray', this.subjectArray);
        this.getExamDetails();
      } else {
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
    this.sisService.getAllStudents({
      login_id: this.data.au_login_id,
      class_id: this.class_id,
      sec_id: this.sec_id,
      term_id: this.term_id,
    }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.studentDetails = result.data[0];
        if (this.studentDetails.au_profileimage) {
          this.defaultsrc = "https://apisis.invictusdigisoft.com/createonfly.php?src=" + this.studentDetails.au_profileimage + "&h=55&w=44";
        }
        //this.defaultsrc = this.studentDetails.au_profileimage;

        if (this.studentDetails.height && this.studentDetails.weight) {
          var heightInMeter = (Number(this.studentDetails.height) / 100);
          var weightInKg = (Number(this.studentDetails.weight));
          this.studentDetails['bmi'] = (weightInKg / (heightInMeter * heightInMeter)).toFixed(2);
        }

        if (this.studentDetails.active_parent === 'M') {
          this.studentDetails.active_parent_name = this.studentDetails.mother_name;
        } else if (this.studentDetails.active_parent === 'F') {
          this.studentDetails.active_parent_name = this.studentDetails.father_name;
        } else if (this.studentDetails.active_parent === 'G') {
          this.studentDetails.active_parent_name = this.studentDetails.guardian_name;
        }
        this.getResultEntryStudent();
      }
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }
  getFinalAssessment(sub_category) {
    let final_assessment = 0;
    this.printData.so_printData.forEach(element => {
      final_assessment += element.term_total_mark[sub_category]
    });
    return final_assessment;
  }
  finalAssessmentOfSubject(sub_id, so_printData) {
    let final_assessment = 0;
    so_printData.forEach(element => {
      element.sub_mark.forEach(psubject => {
        if (psubject.sub_id == sub_id) {
          if(this.roundOff) final_assessment += Math.ceil(psubject.sub_grade_mark)
          else final_assessment += psubject.sub_grade_mark
        }
      });
    });
    if(this.roundOff) final_assessment = Math.ceil(final_assessment)
    return final_assessment.toFixed(2);
  }
}
