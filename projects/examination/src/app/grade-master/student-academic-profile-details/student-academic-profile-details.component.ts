import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, ProcesstypeExamService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-student-academic-profile-details',
  templateUrl: './student-academic-profile-details.component.html',
  styleUrls: ['./student-academic-profile-details.component.css']
})
export class StudentAcademicProfileDetailsComponent implements OnInit {
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
  currentUser: any;
  principalArray: any[] = [];
  vicePrincipalArray: any[] = [];
  schoolAdmin: any[] = [];
  classTeacher: any[] = [];
  subjectTeacher: any[] = [];
  lastRecordId: any;
  loginId: any;
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
    this.processtypeService.setProcesstype(4);
    this.buildForm();
    this.getActivity();
    this.getActivityClub();
    this.getLevelOfInterest();
    this.getEventLevel();
    this.getAuthority();
    this.getStudentLastRecordPerProcessType();
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
    if (login_id) {
      this.finalAwardArray = [];
      this.finalActivityArray = [];
      this.skillAwardsArray = [];
      this.sisService.getSkillAwards({ login_id: login_id, user: 'User' }).subscribe((result: any) => {
        if (result.status === 'ok') {
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
    if (login_id) {
      this.principalArray = [];
      this.vicePrincipalArray = [];
      this.schoolAdmin = [];
      this.classTeacher = [];
      this.subjectTeacher = [];

      const getJson = { 'user': 'user', 'era_type': 'general', 'login_id': login_id };
      this.sisService.getGeneralRemarks(getJson).subscribe((result: any) => {
        if (result.status === 'ok') {
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
        this.lastRecordId = result.data[0].last_record;
        this.loginId = result.data[0].au_login_id;
        this.getSkillsAwards(this.loginId);
        this.getRemarks(this.loginId);
      }
    });

  }
  next(admno) {
    this.loginId = admno;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
  }
  prev(admno) {
    this.loginId = admno;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
  }
  first(admno) {
    this.loginId = admno;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
  }
  last(admno) {
    this.loginId = admno;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
  }
  key(admno) {
    this.loginId = admno;
    this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
  }

}
