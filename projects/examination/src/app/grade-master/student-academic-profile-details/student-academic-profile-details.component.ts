import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, ProcesstypeExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StudentAcademicProfileComponent } from '../student-academic-profile/student-academic-profile.component';
@Component({
  selector: 'app-student-academic-profile-details',
  templateUrl: './student-academic-profile-details.component.html',
  styleUrls: ['./student-academic-profile-details.component.css']
})
export class StudentAcademicProfileDetailsComponent implements OnInit, OnChanges {
  @ViewChild(StudentAcademicProfileComponent) studentAcademicProfile: StudentAcademicProfileComponent;
  activityform: FormGroup;
  awardsform: FormGroup;
  activityArray: any[] = [];
  activityClubArray: any[] = [];
  levelOfIntrestArray: any[] = [];
  eventLevelArray: any[] = [];
  authorityArray: any[] = [];
  finalActivityArray: any[] = [];
  finalActivityArray2: any[] = [];
  finalAwardArray: any[] = [];
  finalAwardArray2: any[] = [];
  skillAwardsArray: any[] = [];
  remarkArray: any[] = [];
  currentExam: any;
  currentExamIndex: number;
  examPre = true;
  examNext = true;
  defaultRemark = false;
  defaultskill = false;
  currentUser: any;
  principalArray: any[] = [];
  vicePrincipalArray: any[] = [];
  schoolAdmin: any[] = [];
  classTeacher: any[] = [];
  subjectTeacher: any[] = [];
  lastRecordId: any;
  loginId: any;
  termsArray: any[] = [];
  termId = '1';
  termindex = 0;
  session: any = {};
  performanceNoRecord = true;
  sessionwisePerformance: any = {};
  performanceTab = 'session';
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public processtypeService: ProcesstypeExamService,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
    this.processtypeService.setProcesstype(4);
    this.buildForm();
    this.getActivity();
    this.getActivityClub();
    this.getLevelOfInterest();
    this.getEventLevel();
    this.getAuthority();
    this.getStudentLastRecordPerProcessType();
  }
  ngOnChanges(){
    console.log('ngOnchanged', this.loginId);
    console.log('studentAcademicProfile', this.studentAcademicProfile);
  }
  buildForm() {
    this.activityform = this.fbuild.group({
      esk_id: '',
      esk_activity_name: '0',
      esk_level_of_interest: '0',
      esk_activity_club: '0',
      esk_enrollment_duration: '',
      esk_teacher_remark: '',
    });
    this.awardsform = this.fbuild.group({
      eaw_id: '',
      eaw_activity_name: '0',
      eaw_level_of_interest: '0',
      eaw_authority: '0',
      eaw_event_level: '0',
      eaw_teacher_remark: '',
    });
  }
  tabChanged(event) {
    console.log('tabChanged',event);
    this.termindex = event.index;
    this.termId = this.termsArray[event.index].id;
    this.sessionWisePerformance(this.studentAcademicProfile.studentdetails);
  }
  getClassTerm(class_id) {
    this.termsArray = [];
    console.log('termsArray 1', this.termsArray);
    this.examService.getClassTerm({class_id: class_id}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.termsArray = [];
        result.data.ect_no_of_term.split(',').forEach(element => {
          console.log(element);
          this.termsArray.push({id: element, name: result.data.ect_term_alias + ' ' +element});
        });
        console.log('termsArray 2', this.termsArray);
      }
    });
  }
  sessionWisePerformance(studentdetails) {
    this.performanceNoRecord = true;
    this.sessionwisePerformance = {};
    const param: any = {};
    param.class_id = studentdetails.au_class_id;
    param.sec_id = studentdetails.au_sec_id;
    param.login_id = [studentdetails.au_login_id];
    param.term_id = this.termId;
    param.ses_id = this.session.ses_id;
    this.examService.sessionWisePerformance(param).subscribe((result: any) => {
      if(result && result.status === 'ok') {
        if(result.data.length > 0) {
          const performanceData = result.data[0];
          const xcategories: any[] = [];
          const series: any[] = [];
          const seriesDataArr: any[] = [];
          performanceData['sub_mark'].forEach(sub => {
            if(sub.sub_parent_id === '0') {
              xcategories.push(sub.sub_name);
              sub['sub_exam_mark'].forEach(exam => {
                const sind = series.findIndex(e => exam.exam_name === e.name);
                if(sind === -1) {
                  series.push({
                    name: exam.exam_name,
                    data: [exam.student_mark_100_per]
                  });
                } else {
                  series[sind]['data'].push(exam.student_mark_100_per);
                }
              });
            }
          });
          console.log(xcategories);
          console.log(series);
          this.graphData('column', xcategories, series);
          this.performanceNoRecord = false;

        } else {
          this.performanceNoRecord = true;
        }        
      } else {
        this.performanceNoRecord = true;
      }
    });
  }
  graphData(chartType, xcategories, series,) {
    this.sessionwisePerformance = {
      chart: {
        type: chartType,
        height: '280px',
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: xcategories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'In %'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: series
    };
  }
  getActivity() {
    this.sisService.getActivity().subscribe((result: any) => {
      if (result) {
        this.activityArray = result.data;
      }
    });
  }
  getActivityClub() {
    this.sisService.getActivityClub().subscribe((result: any) => {
      if (result) {
        this.activityClubArray = result.data;
      }
    });
  }
  getLevelOfInterest() {
    this.sisService.getLevelOfInterest().subscribe((result: any) => {
      if (result) {
        this.levelOfIntrestArray = result.data;
      }
    });
  }
  getEventLevel() {
    this.sisService.getEventLevel().subscribe((result: any) => {
      if (result) {
        this.eventLevelArray = result.data;
      }
    });
  }
  getAuthority() {
    this.sisService.getAuthority().subscribe((result: any) => {
      if (result) {
        this.authorityArray = result.data;
      }
    });
  }
  getActivityName(value) {
    for (const item of this.activityArray) {
      if (item.act_id === value) {
        return item.act_name;
      }
    }
  }
  getActivityClubName(value) {
    for (const item of this.activityClubArray) {
      if (item.acl_id === value) {
        return item.acl_name;
      }
    }
  }
  getAuthorityName(value) {
    for (const item of this.authorityArray) {
      if (item.aut_id === value) {
        return item.aut_name;
      }
    }
  }
  getEventLevelName(value) {
    for (const item of this.eventLevelArray) {
      if (item.el_id === value) {
        return item.el_name;
      }
    }
  }
  getbadges(value) {
    for (const item of this.eventLevelArray) {
      if (Number(item.el_id) === Number(value)) {
        return item.el_badges;
      }
    }
  }
  getLevelofInterestName(value) {
    for (const item of this.levelOfIntrestArray) {
      if (item.loi_id === value) {
        return item.loi_name;
      }
    }
  }
  getSkillsAwards(login_id) {
    this.defaultskill = false;
    if (login_id) {
      this.finalAwardArray = [];
      this.finalActivityArray = [];
      this.skillAwardsArray = [];
      this.sisService.getSkillAwards({ login_id: login_id, user: 'User' }).subscribe((result: any) => {
        if (result.status === 'ok') {
          this.defaultskill = true;
          this.skillAwardsArray.push(result.awards);
          this.skillAwardsArray.push(result.skills);
          if (this.skillAwardsArray[0]) {
            for (const item of this.skillAwardsArray[0]) {
              this.finalAwardArray.push(item);
              this.examNavigate(0);
            }
          }
          if (this.skillAwardsArray[1]) {
            for (const item of this.skillAwardsArray[1]) {
              this.finalActivityArray.push(item);
              
            }
          }
        } else {
          this.finalAwardArray = [];
          this.finalActivityArray = [];
          this.skillAwardsArray = [];
        }
      });
    }
  }
  examNavigate(index) {
    this.currentExamIndex = index;
    this.currentExam = this.finalAwardArray[this.currentExamIndex];
    if (this.finalAwardArray.length === 1 || this.finalAwardArray.length === 0) {
      this.examPre = true;
      this.examNext = true;
    } else if (this.currentExamIndex === this.finalAwardArray.length - 1) {
      this.examNext = true;
      this.examPre = false;
    } else if (this.currentExamIndex === 0) {
      this.examNext = false;
      this.examPre = true;
    } else {
      this.examPre = false;
      this.examNext = false;
    }

  }
  getRemarks(login_id) {
    this.defaultRemark = false;
    if (login_id) {
      this.principalArray = [];
      this.vicePrincipalArray = [];
      this.schoolAdmin = [];
      this.classTeacher = [];
      this.subjectTeacher = [];

      const getJson = { 'user': 'user', 'era_type': 'general', 'login_id': login_id };
      this.sisService.getGeneralRemarks(getJson).subscribe((result: any) => {
        if (result.status === 'ok') {
          this.defaultRemark = true;
          this.remarkArray = result.generalRemarks ? result.generalRemarks : [];
          for (const item of this.remarkArray) {
            if (Number(item.era_aut_id) === 1) {
              this.principalArray.push(item);
            } else if (Number(item.era_aut_id) === 2) {
              this.vicePrincipalArray.push(item);
            } else if (Number(item.era_aut_id) === 3 || Number(item.era_aut_id) === 4) {
              this.schoolAdmin.push(item);
            } else if (Number(item.era_aut_id) === 5) {
              this.classTeacher.push(item);
            } else if (Number(item.era_aut_id) === 6) {
              this.subjectTeacher.push(item);
            }
          }
        }
      });
    }

  }
  getStudentLastRecordPerProcessType() {
    this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
      if (result.status === 'ok') {
        console.log('getStudentLastRecordPerProcessType', result.data);
        this.lastRecordId = result.data[0].last_record;
        this.loginId = result.data[0].au_login_id;
        this.sisService.getStudentInformation({ au_login_id: result.data[0].last_record, au_status: '1', au_process_type: '4' }).subscribe((result1: any) => {
          if(result1 && result1.status === 'ok') {
            this.termsArray = [];
            this.termId = '1';
            this.termindex = 0;
            this.sessionWisePerformance(result1.data[0]);
            this.getClassTerm(result1.data[0].au_class_id);
          }
        });
        this.getSkillsAwards(this.loginId);
        this.getRemarks(this.loginId);
      }
    });

  }
  next(admno) {
    this.setLoginId(admno);
  }
  prev(admno) {
    this.setLoginId(admno);
  }
  first(admno) {
    this.setLoginId(admno);
  }
  last(admno) {
    this.setLoginId(admno);
  }
  key(admno) {
    this.setLoginId(admno);
  }
  setLoginId(admno) {
    this.loginId = admno;
    this.termsArray = [];
    this.termId = '1';
    this.termindex = 0;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
    this.sessionWisePerformance(this.studentAcademicProfile.studentdetails);
    this.getClassTerm(this.studentAcademicProfile.studentdetails.au_class_id);
  }

}
