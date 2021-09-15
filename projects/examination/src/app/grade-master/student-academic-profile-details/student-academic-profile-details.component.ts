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
  @ViewChild('addModal') addModal;

  activityform: FormGroup;
	generalRemarkForm: FormGroup;
  awardsform: FormGroup;
  activityArray: any[] = [];
  areaArray: any[] = [];
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
	sessionArray: any[] = [];
	finalSpannedArray: any[] = [];
	finalGeneralRemarkArray: any[] = [];
	htmlFinalGeneralRemarkArray: any[] = [];
	generalRemarkUpdateFlag = false;
	generalAddToList = false;
	generalRemarkValue: any;
  currentExam: any;
  currentExamIndex: number;
  examPre = true;
  examNext = true;
  defaultRemark = false;
  defaultskill = false;
	updateFlag = false;
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
  param: any = {};
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
  performanceNoRecord = true;
  sessionwisePerformanceData: any = {};
  yearwisePerformanceData: any = {};
  performanceTab = 'session';
  currentUserDetails: any = {};
  skillDetails: any;
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
    this.getStudentLastRecordPerProcessType();
    this.buildForm();
    this.getActivity();
    this.getActivityClub();
    this.getLevelOfInterest();
    this.getEventLevel();
    this.getAuthority();
    this.getArea();
    console.log("on init called");
  }
  ngOnChanges() {
    console.log('ngOnchanged', this.loginId);
    console.log('studentAcademicProfile', this.studentAcademicProfile);
    // this.getSkillsAwards(this.loginId);
    // this.getStudentLastRecordPerProcessType();
    // this.getAdditionalDetails(this.loginId);
  }
  getPerformance(tabname) {
    this.performanceTab = tabname;
    if (tabname === 'year') {
      this.yearWisePerformance(this.currentUserDetails);
    } else {
      this.sessionWisePerformance(this.currentUserDetails);
    }
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
    this.generalRemarkForm = this.fbuild.group({
			era_type: 'general',
			era_doj: new Date(),
			era_aut_id: '',
			era_ar_id: '',
			era_teachers_remark: '',
			era_login_id: ''
		});
  }
  tabChanged(event) {
    console.log('tabChanged', event);
    this.termindex = event.index;
    this.termId = this.termsArray[event.index].id;
    this.sessionWisePerformance(this.studentAcademicProfile.studentdetails);
  }
  yearWisePerformance(studentdetails) {
    this.performanceNoRecord = true;
    const param: any = {};
    param.login_id = [studentdetails.au_login_id];
    this.examService.yearWisePerformance(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data.length > 0) {
          const performanceYearDataArr = result.data;
          const xcategories: any[] = [];
          const series: any[] = [];
          const seriesDataArr: any[] = [];
          performanceYearDataArr.forEach(each => {
            if (each.sec_name) {
              xcategories.push(each.class_name + '-' + each.sec_name);
            } else {
              xcategories.push(each.class_name);
            }
            seriesDataArr.push(this.roundTwoDecimai(each.term_student_total_percentage));
          });
          series.push({
            name: '',
            showInLegend: false,
            type: 'column',
            data: seriesDataArr
          })
          series.push({
            name: '',
            showInLegend: false,
            type: 'spline',
            data: seriesDataArr
          })
          this.graphData('', xcategories, series);
          this.performanceNoRecord = false;

        } else {
          this.performanceNoRecord = true;
        }
      } else {
        this.performanceNoRecord = true;
      }
    });
  }
  getClassTerm(class_id) {
    this.termsArray = [];
    console.log('termsArray 1', this.termsArray);
    this.examService.getClassTerm({ class_id: class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.termsArray = [];
        result.data.ect_no_of_term.split(',').forEach(element => {
          console.log(element);
          this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
        });
        console.log('termsArray 2', this.termsArray);
      }
    });
  }
  roundTwoDecimai(num) {
    return Math.round(num * 100) / 100
  }
  sessionWisePerformance(studentdetails) {
    this.performanceNoRecord = true;
    this.sessionwisePerformanceData = {};
    const param: any = {};
    param.class_id = studentdetails.au_class_id;
    param.sec_id = studentdetails.au_sec_id;
    param.login_id = [studentdetails.au_login_id];
    param.term_id = this.termId;
    param.ses_id = this.session.ses_id;
    this.examService.sessionWisePerformance(param).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        if (result.data.length > 0) {
          const performanceData = result.data[0];
          const xcategories: any[] = [];
          const series: any[] = [];
          const seriesDataArr: any[] = [];
          performanceData['sub_mark'].forEach(sub => {
            if (sub.sub_parent_id === '0') {
              xcategories.push(sub.sub_name);
              sub['sub_exam_mark'].forEach(exam => {
                const sind = series.findIndex(e => exam.exam_name === e.name);
                if (sind === -1) {
                  series.push({
                    name: exam.exam_name,
                    data: [this.roundTwoDecimai(exam.student_mark_100_per)]
                  });
                } else {
                  series[sind]['data'].push(this.roundTwoDecimai(exam.student_mark_100_per));
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
  graphData(chartType, xcategories, series, ) {
    this.sessionwisePerformanceData = {
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
        labels: {
          format: '{value}%'
        },
        min: 0,
        title: {
          text: ''
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
        },
        series: {
          pointWidth: 15
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

	getArea() {
		this.sisService.getArea().subscribe((result: any) => {
			if (result) {
				this.areaArray = result.data;
			}
		});
	}

	getAreaName(value) {
		for (const item of this.areaArray) {
			if (item.ar_id === value) {
				return item.ar_name;
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

  getAdditionalDetails(login_id){
    if (login_id) {
      this.finalAwardArray = new Array<any>();
      this.finalActivityArray = [];
      this.skillAwardsArray = [];
      console.log("get add check 1 ", this.finalAwardArray);
      this.sisService.getAdditionalDetails({ au_login_id: login_id }).subscribe((result: any) => {
        if (result.status === 'ok') {
          console.log("get add check 2 ", this.finalAwardArray);
          this.defaultskill = true;
          this.finalAwardArray = result.data[0].awardsDetails;
          this.skillAwardsArray.push(result.data[0].awardsDetails);
          console.log("get add check 3 ", this.finalAwardArray);
          // if (this.skillAwardsArray[0]) {
          //   for (const item of this.skillAwardsArray[0]) {
          //     this.finalAwardArray.push(item);
          //     console.log("get add check 4 ", this.finalAwardArray);
          //     this.examNavigate(0);
          //     console.log("get add check 5 ", this.finalAwardArray);
          //   }
          // }
          // console.log("get add check 6 ", this.finalAwardArray);
          // if (this.skillAwardsArray[1]) {
          //   for (const item of this.skillAwardsArray[1]) {
          //     console.log("get add check 7 ", this.finalAwardArray);
          //     this.finalActivityArray.push(item);

          //   }
          // }
          console.log("get add check 8 ", this.finalAwardArray);
          console.log("final array from home function ", this.finalAwardArray);
          this.renderData();
        } else {
          this.finalAwardArray = [];
          this.finalActivityArray = [];
          this.skillAwardsArray = [];
          this.renderData();
        }
      });
    }
    this.renderData();
  }

  // getSkillsAwards(login_id) {
  //   this.defaultskill = false;
  //   if (login_id) {
  //     this.finalAwardArray = [];
  //     this.finalActivityArray = [];
  //     this.skillAwardsArray = [];
  //     this.sisService.getSkillAwards({ login_id: login_id, user: 'User' }).subscribe((result: any) => {
  //       if (result.status === 'ok') {
  //         this.defaultskill = true;
  //         this.skillAwardsArray.push(result.awards);
  //         this.skillAwardsArray.push(result.skills);
  //         if (this.skillAwardsArray[0]) {
  //           for (const item of this.skillAwardsArray[0]) {
  //             this.finalAwardArray.push(item);
  //             this.examNavigate(0);
  //           }
  //         }
  //         if (this.skillAwardsArray[1]) {
  //           for (const item of this.skillAwardsArray[1]) {
  //             this.finalActivityArray.push(item);

  //           }
  //         }
  //         this.renderData();
  //       } else {
  //         this.finalAwardArray = [];
  //         this.finalActivityArray = [];
  //         this.skillAwardsArray = [];
  //       }
  //     });
  //   }
  // }
  examNavigate(index) {
    this.currentExamIndex = index;
    this.currentExam = this.finalAwardArray[this.currentExamIndex];
    if (this.finalAwardArray) {
      if(this.finalAwardArray.length === 1 || this.finalAwardArray.length === 0){
        this.examPre = true;
        this.examNext = true;
      }
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
      this.remarkArray = [];

      console.log("r check 1", this.remarkArray);

      const getJson = { 'user': 'user', 'era_type': 'general', 'login_id': login_id };
      this.sisService.getGeneralRemarks(getJson).subscribe((result: any) => {
        if (result.status === 'ok') {
          this.defaultRemark = true;
          this.remarkArray = result.generalRemarks ? result.generalRemarks : [];
          console.log("r check 2", this.remarkArray);
          this.prepareGroupAuthorityData(this.remarkArray);
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
          console.log("r check 3", this.remarkArray);
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
          if (result1 && result1.status === 'ok') {
            this.currentUserDetails = result1.data[0];
            this.termsArray = [];
            this.termId = '1';
            this.termindex = 0;
            this.sessionWisePerformance(this.currentUserDetails);
            this.getClassTerm(this.currentUserDetails.au_class_id);
          }
        });
        // this.getSkillsAwards(this.loginId);
        this.getAdditionalDetails(this.loginId);
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
    this.performanceTab = 'session'
    // this.getSkillsAwards(this.loginId);
    this.getRemarks(this.loginId);
    this.currentUserDetails = this.studentAcademicProfile.studentdetails;
    this.sessionWisePerformance(this.currentUserDetails);
    this.getClassTerm(this.currentUserDetails.au_class_id);
    this.getAdditionalDetails(this.loginId);
  }

	openAddModal(value) {
		this.param.module = value;
		this.param.text = value;
		this.param.eventLevelArray = this.eventLevelArray;
		this.param.authorityArray = this.authorityArray;
		this.param.levelOfIntrestArray = this.levelOfIntrestArray;
		this.param.activityArray = this.activityArray;
		this.param.areaArray = this.areaArray;
		this.addModal.openModal(this.param);
	}

  prepareRemarksForUpdate(value){
    // console.log(this.remarkArray);
    this.remarkArray.push(value.value);
}
prepareSkillsForUpdate(value){
  if(this.skillAwardsArray){
    if(this.skillAwardsArray.length > 0){
      this.skillAwardsArray.push(value.value);
    }else{
      // let arr = new Array<any>(3);
      this.skillAwardsArray[0] = this.skillAwardsArray;
      this.skillAwardsArray[1] = [];
      this.skillAwardsArray[2] = [];
      this.skillAwardsArray[2].push(value.value);
    }
  }
}

	addOk(data) { 
    console.log("add ok data", data);
		console.log("Hi add me has been clicked");
    console.log("add ok "+data.controls['form_name'].value);
    // this.getStudentLastRecordPerProcessType();
    console.log("data login data ", this.loginId);
    if (data) {
			if(data.controls['form_name'].value == 'remarks'){
        console.log(data);
        data.controls['era_login_id'].setValue(this.loginId);
        // console.log("add ok "+data.controls['era_login_id'].value);
        this.prepareRemarksForUpdate(data);
        this.sisService.addRemarks({
          au_login_id: this.loginId ,remarksGeneral: this.remarkArray
        }).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            this.commonAPIService.showSuccessErrorMessage(res.message, 'success');
            this.getRemarks(this.loginId);
          } else {
            this.commonAPIService.showSuccessErrorMessage(res.message, 'error');
          }
        });
      }else if(data.controls['form_name'].value == 'skills'){
        // this.prepareSkillsForUpdate(data);
        let tempSkills = {
            "eaw_id": "",
            "eaw_login_id" : this.loginId,
            "eaw_status" : "1",
            "eaw_ses_id": data.controls['eaw_ses_id'].value,
            "eaw_activity_name": data.controls['eaw_activity_name'].value,
            "eaw_level_of_interest": data.controls['eaw_level_of_interest'].value,
            "eaw_authority": data.controls['eaw_authority'].value,
            "eaw_event_level": data.controls['eaw_event_level'].value,
            "eaw_teacher_remark": data.controls['eaw_teacher_remark'].value
        };
        if(data){
          this.finalAwardArray.push(tempSkills);
        }
        const tabTwoJSON = {
          au_login_id: this.loginId,
          educationDetails: [],
          documentDetails: [],
          awardsDetails: data ? this.finalAwardArray : []
        };
        // console.log(this.skillAwardsArray[0].push(data.value));
        console.log("SKAD >>>>>>>>>>>>>>>>>",tabTwoJSON);
        this.sisService.addSkills(tabTwoJSON).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            this.commonAPIService.showSuccessErrorMessage(res.message, 'success');
            this.getAdditionalDetails(this.loginId);
            this.renderData();
            // this.buildForm();
          } else {
            this.commonAPIService.showSuccessErrorMessage(res.message, 'error');
          }
        });
      }
      this.updateFlag = true;
      // this.renderData();

    // this.getStudentLastRecordPerProcessType();
    }
	}
	updateGeneralRemarkList() {
		this.finalGeneralRemarkArray[this.generalRemarkValue] = this.generalRemarkForm.value;
		this.commonAPIService.showSuccessErrorMessage('General Remark List Updated', 'success');
		this.generalRemarkForm.reset();
		this.generalRemarkUpdateFlag = false;
		this.generalAddToList = false;
	}


	prepareGroupAuthorityData(formData) {
		const groupedArr = [];
		const newAuthority = {};

		formData.forEach(item => {
			newAuthority[item.era_aut_id] ?
				newAuthority[item.era_aut_id].push(item) :
				(
					newAuthority[item.era_aut_id] = [],
					newAuthority[item.era_aut_id].push(item)
				);
		}
		);
		for (let i = 0; i < Object.keys(newAuthority).length; i++) {
			const col = Object.keys(newAuthority)[i];
			const result = newAuthority[col];
			groupedArr.push(result);
		}
		this.htmlFinalGeneralRemarkArray = groupedArr;

    console.log("i am grouped array");
    console.log(this.htmlFinalGeneralRemarkArray);
	}

	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '7') {
						this.settingsArray.push({
							cos_tb_id: item.cos_tb_id,
							cos_ff_id: item.cos_ff_id,
							cos_status: item.cos_status,
							ff_field_name: item.ff_field_name
						});
					}
				}
			}
		});
	}
	checkIfFieldExist(value) {
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}
	getSession() {
		this.sisService.getSession().subscribe((result: any) => {
			if ((result.status === 'ok')) {
				this.sessionArray = result.data;
			}
		});
	}
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}

  // Display Skills and Awards in Grouped Set
  renderData() {
    console.log("i am in render data ");
    console.log(this.finalAwardArray);
    if(this.finalAwardArray){
      for (let i = 0; i < this.finalAwardArray.length; i++) {
        console.log("length of final award array "+this.finalAwardArray.length);
        const spannArray: any[] = [];
        spannArray.push({
          act_name: this.finalAwardArray[i].eaw_activity_name,
          eaw_id: this.finalAwardArray[i].eaw_id,
          eaw_ses_id: this.finalAwardArray[i].eaw_ses_id,
          eaw_level_of_interest: this.finalAwardArray[i].eaw_level_of_interest,
          eaw_authority: this.finalAwardArray[i].eaw_authority,
          eaw_event_level: this.finalAwardArray[i].eaw_event_level,
          eaw_teacher_remark: this.finalAwardArray[i].eaw_teacher_remark,
        });
        for (let j = i + 1; j < this.finalAwardArray.length; j++) {
          if (this.finalAwardArray[i].eaw_activity_name === this.finalAwardArray[j].eaw_activity_name) {
            spannArray.push({
              act_name: this.finalAwardArray[i].eaw_activity_name,
              eaw_id: this.finalAwardArray[j].eaw_id,
              eaw_ses_id: this.finalAwardArray[j].eaw_ses_id,
              eaw_level_of_interest: this.finalAwardArray[j].eaw_level_of_interest,
              eaw_authority: this.finalAwardArray[j].eaw_authority,
              eaw_event_level: this.finalAwardArray[j].eaw_event_level,
              eaw_teacher_remark: this.finalAwardArray[j].eaw_teacher_remark,
            });
          }
        }
        const findex = this.finalSpannedArray.findIndex(f => f.act_name === this.finalAwardArray[i].eaw_activity_name);
        if (findex === -1) {
          this.finalSpannedArray.push({
            act_name: this.finalAwardArray[i].eaw_activity_name,
            details: spannArray
          });
        }
        console.log("final spanned array : ", this.finalSpannedArray);
      }
    }else{
      this.finalAwardArray = [];
    }
		console.log("I am final awards array");
		console.log(this.finalAwardArray);
	}

}
