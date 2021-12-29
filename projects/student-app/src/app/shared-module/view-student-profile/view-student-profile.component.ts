import { Component, OnInit } from '@angular/core';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../../../src/app/login/login/authentication.service';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-view-student-profile',
  templateUrl: './view-student-profile.component.html',
  styleUrls: ['./view-student-profile.component.css']
})
export class ViewStudentProfileComponent implements OnInit {
  currentUser: any = {};
  classArray2: any[] = [];
  sessionArray: any[] = [];
  nationalityArray: any[] = [];
  previousSchoolDet: any[] = [];
  payMents: any[] = [];
  transportDet: any[] = [];
  customQArr: any[] = [];
  skillDetails: any[] = [];
  religionsArray: any[] = [];
  motherTongueArray: any[] = [];
  genderArray: any[] = [];
  categoryArray: any[] = [];
  countryArray: any[] = [];
  stateArray: any[] = [];
  qualificationArray: any[] = [];
  annualIncomeArray: any[] = [];
  occupationTypeArray: any[] = [];
  activityArray: any[] = [];
  activityClubArray: any[] = [];
  levelOfIntrestArray: any[] = [];
  eventLevelArray: any[] = [];
  studentDet: any[] = [];
  authorityArray: any[] = [];
  busRouteArray: any[] = [];
  busStopArray: any[] = [];
  reasonArray: any[] = [];
  studentdetails: any = {};
  parentDet: any[] = [];
  sibDet: any[] = [];
  addressDetails: any = {};
  schoolInfo: any = {};
  skills: any[] = [];
  remarks: any[] = [];
  profileimage: any = '';
  cityName: any;
	userSaveData: any;
	currentDate = new Date();
	webDeviceToken: any = {};
	returnUrl: string;
  model: any;

  constructor(    
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
    private common: CommonAPIService,
    public dom: DomSanitizer,
		private _cookieService: CookieService,
		private loaderService: CommonAPIService,
    private erp: ErpCommonService) {
      if (_cookieService.get('remember')) {
        this.model.username = this._cookieService.get('username');
        this.model.password = this._cookieService.get('password');
        this.model.rememberme = this._cookieService.get('rememberme');
      }
     }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getStudentDetails(this.currentUser);
    this.getClass();
    this.getSession();
    this.getNationality();
    this.getReligionDetails();
    this.getMotherTongue();
    this.getCountry();
    this.getState();
    this.getGender();
    this.getCategory();
    this.getQualifications();
    this.getAnnualIncome();
    this.getOccupationType();
    this.getActivity();
    this.getActivityClub();
    this.getLevelOfInterest();
    this.getEventLevel();
    this.getAuthority();
    this.getBusRoute();
    this.getSchool();
    this.getBusStop();
    this.getReason();
  }
  getStudentDetails(user) {
    this.erp.getStudent({ au_login_id: user.login_id, au_process_type: '4', last_class: true }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        console.log("Student details : ", res);
        this.studentdetails = res.data[0];
        this.parentDet = this.studentdetails.parentDetails && this.studentdetails.parentDetails.length > 0 ?
          this.studentdetails.parentDetails : [];
        this.sibDet = this.studentdetails.personalDetails && this.studentdetails.personalDetails.length > 0
          && this.studentdetails.personalDetails[0].siblingDetails && this.studentdetails.personalDetails[0].siblingDetails.length > 0
          ? this.studentdetails.personalDetails[0].siblingDetails : [];
        this.addressDetails = this.studentdetails.personalDetails && this.studentdetails.personalDetails.length > 0
          && this.studentdetails.personalDetails[0].addressDetails && this.studentdetails.personalDetails[0].addressDetails.length > 0
          ? this.studentdetails.personalDetails[0].addressDetails[0] : [];
        this.studentDet.push({ au_class_id: this.studentdetails.au_class_id });
        if (this.studentdetails.personalDetails && this.studentdetails.personalDetails[0]) {
          this.getCityNameByCityId(this.studentdetails.personalDetails[0].addressDetails[0].ea_city);
          this.studentDet.push(this.studentdetails.personalDetails[0]);
          if (this.studentdetails.personalDetails[0].upd_gender === 'M') {
            this.profileimage = this.studentdetails.au_profileimage ?
              this.studentdetails.au_profileimage : 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
          } else if (this.studentdetails.personalDetails[0].upd_gender === 'F') {
            this.profileimage = this.studentdetails.au_profileimage ? this.studentdetails.au_profileimage :
              'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
          } else {
            this.profileimage = this.studentdetails.au_profileimage ? this.studentdetails.au_profileimage :
              'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
          }
        }
        console.log(this.profileimage);
      }
    });
    console.log("student Details ", this.studentdetails);
  }
  getClass() {
    this.erp.getClassData({}).subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.classArray2[item.class_id] = item.class_name;
          }
        }
      }
    );
  }
  getSchool() {
    this.erp.getSchool().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          this.schoolInfo = result.data[0];
        }
      }
    );
  }

  getSession() {
    this.erp.getSession().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.sessionArray[item.ses_id] = item.ses_name;
          }
        }
      }
    );
  }
  getNationality() {
    this.erp.getNationality().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.nationalityArray[item.nat_id] = item.nat_name;
          }
        }
      }
    );
  }
  getReligionDetails() {
    this.erp.getReligionDetails({}).subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.religionsArray[item.rel_id] = item.rel_name;
          }
        }
      }
    );
  }
  getMotherTongue() {
    this.erp.getMotherTongue({}).subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.motherTongueArray[item.mt_id] = item.mt_name;
          }
        }
      }
    );
  }
  getGender() {
    this.erp.getGender().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.genderArray[item.gen_alias] = item.gen_name;
          }
        }
      }
    );
  }
  getCategory() {
    this.erp.getCategory().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.categoryArray[item.cat_id] = item.cat_name;
          }
        }
      }
    );
  }

  getCountry() {
    this.erp.getCountry().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.countryArray[item.cou_id] = item.cou_name;
          }
        }
      }
    );
  }
  getState() {
    this.erp.getState().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          for (const item of result.data) {
            this.stateArray[item.sta_id] = item.sta_name;
          }
        }
      }
    );
  }

  getQualifications() {
    this.erp.getQualifications2().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.qualificationArray[item.qlf_id] = item.qlf_name;
        }
      }
    });
  }
  getAnnualIncome() {
    this.erp.getAnnualIncome2().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.annualIncomeArray[item.ai_id] = item.ai_from_to;
        }
      }
    });
  }
  getOccupationType() {
    this.erp.getOccupationType2().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.occupationTypeArray[item.ocpt_id] = item.ocpt_name;
        }
      }
    });
  }
  getActivity() {
    this.erp.getActivity().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.activityArray[item.act_id] = item.act_name;
        }
      }
    });
  }
  getActivityClub() {
    this.erp.getActivityClub().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.activityClubArray[item.acl_id] = item.acl_name;
        }
      }
    });
  }

  getLevelOfInterest() {
    this.erp.getLevelOfInterest().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.levelOfIntrestArray[item.loi_id] = item.loi_name;
        }
      }
    });
  }
  getEventLevel() {
    this.erp.getEventLevel().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.eventLevelArray[item.el_id] = item.el_name;
        }
      }
    });
  }
  getAuthority() {
    this.erp.getAuthority().subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.authorityArray[item.aut_id] = item.aut_name;
        }
      }
    });
  }
  getBusRoute() {
    this.busRouteArray = [];
    this.erp.getTransportRoute().subscribe(
      (result: any) => {
        if (result) {
          this.busRouteArray = result.data;
        }
      }
    );
  }

  getBusStop() {
    this.busStopArray = [];
    this.erp.getTransportStop().subscribe(
      (result: any) => {
        if (result) {
          this.busStopArray = result.data;
        }
      }
    );
  }
  getReason() {
    this.erp.getReason({ reason_type: '4' }).subscribe((result: any) => {
      if (result) {
        for (const item of result.data) {
          this.reasonArray[item.reason_id] = item.reason_title;
        }
      }
    });
  }
  checkIfFieldExist2(value) {
    return true;
  }
  getTabsData() {
    this.erp.getAdditionalDetails({ au_login_id: this.currentUser.login_id, au_process_type: '4' }).subscribe((result: any) => {
      if (result.status === 'ok') {
        this.previousSchoolDet = result.data[0].educationDetails;
        this.skillDetails = result.data[0].awardsDetails;
        this.erp.getFeeAccount({ accd_login_id: this.currentUser.login_id }).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            this.transportDet.push(res.data[0]);
          }
        });
      } else {

      }
    });
  }
  getCityNameByCityId(city_id) {
    this.erp.getCityNameByCityId({ city_id: city_id }).subscribe((result: any) => {
      if (result.status === 'ok') {
        if (result.data) {
          this.cityName = result.data[0].cit_name;
          this.getTabsData();
        }
      } else {
        this.cityName = '-';
        this.getTabsData();
      }
    });
  }

  //Switch account login process
  switchAccount(item){
    let username = "";
    let password = "";
    let loginId = "";
    console.log("lemme login please : ", item);
    this.erp.getUser({ au_admission_no: item.esd_admission_no, role_id: 4 }).subscribe((result: any) => {
      if (result.status === 'ok') {
        console.log("lemme c the password : ", result);
        if (result.data) {
          //Login
          username = result.data[0].au_username;
          password = result.data[0].au_password;
          loginId = result.data[0].au_login_id;
          let data = {
            "username" : username,
            "password" : password,
            "loginId" : loginId,
            "rememberme" : 0
          };
          console.log(password);
          this.login(data);
        }
      } else {
        //Throw Error
      }
    });
  }

  login(data) {
    this.model = {
      "username" : data.username,
      "password" : data.password,
      "rememberme" : 0
    };
		this._cookieService.put('username', data.username);
		this._cookieService.put('password', data.password);
		this._cookieService.put('remember', data.rememberme);
		//this.loaderService.setUserPrefix(this.model.username.split("-")[0])
		if (localStorage.getItem("web-token")) {
			this.webDeviceToken = JSON.parse(localStorage.getItem("web-token"));
		}
		this.authenticationService.login(data.username, data.password , this.webDeviceToken['web-token'], 'web', '', 0)
			.subscribe(
				(result: any) => {
          console.log("Login Service : ",result);
					if (result.status === 'ok' && result.data) {
            
						localStorage.clear();
						this._cookieService.removeAll();

						const user = result.data;
						if (result.data.userSaveStateData) {
							this.userSaveData = JSON.parse(result.data.userSaveStateData);
						}
						const tempJson = {
							CID: user.clientKey,
							AN: user.token,
							UR: user.role_id,
							LN: user.login_id,
							PF: user.Prefix
						};
						// user.Prefix = this.model.username.split('-')[0];
						// user.username = this.model.username;
						if (user) {
							localStorage.setItem('currentUser', JSON.stringify(user));
							this._cookieService.put('userData', JSON.stringify(tempJson));
						}
						if (this._cookieService.get('userData')) {
							this.common.getSession().subscribe((result3: any) => {
								if (result3 && result3.status === 'ok') {
									this.sessionArray = result3.data;
									this.common.getSchool().subscribe((result2: any) => {
										if (result2.status === 'ok') {
											this.schoolInfo = result2.data[0];
											localStorage.setItem('expire_time', JSON.stringify({ expire_time: this.schoolInfo.session_expire }));
											if (this.currentDate.getMonth() + 1 >= Number(this.schoolInfo.session_start_month) &&
												Number(this.schoolInfo.session_end_month) <= this.currentDate.getMonth() + 1) {
												const currentSession =
													(Number(this.currentDate.getFullYear()) + '-' + Number(this.currentDate.getFullYear() + 1)).toString();
												const findex = this.sessionArray.findIndex(f => f.ses_name === currentSession);
												if (findex !== -1) {
													const sessionParam: any = {};
													sessionParam.ses_id = this.sessionArray[findex].ses_id;
													localStorage.setItem('session', JSON.stringify(sessionParam));
												}
											} else {
												const currentSession =
													(Number(this.currentDate.getFullYear() - 1) + '-' + Number(this.currentDate.getFullYear())).toString();
												const findex = this.sessionArray.findIndex(f => f.ses_name === currentSession);
												if (findex !== -1) {
													const sessionParam: any = {};
													sessionParam.ses_id = this.sessionArray[findex].ses_id;
													localStorage.setItem('session', JSON.stringify(sessionParam));
												}
											}
											let returnUrl: any;
											console.log('this.userSaveData', this.userSaveData);
											// this.returnUrl = '/student';
                      if ((this.userSaveData && !this.userSaveData.pro_url) || !this.userSaveData) {
												localStorage.setItem('project', JSON.stringify({ pro_url: 'student' }));
												returnUrl = '/student';
											} else {
												returnUrl = this.userSaveData.pro_url;
												localStorage.setItem('project', JSON.stringify({ pro_url: this.userSaveData.pro_url }));
											}
											if (this.userSaveData && this.userSaveData.ses_id) {
												const sessionParam: any = {};
												sessionParam.ses_id = this.userSaveData.ses_id;
												localStorage.setItem('session', JSON.stringify(sessionParam));
											}
											if (JSON.parse(localStorage.getItem('currentUser')).role_id === '1') {
												this.returnUrl = '/admin';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '2') {
												this.returnUrl = returnUrl + '/school';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '3') {
												this.returnUrl = '/teacher';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '4') {
												this.returnUrl = '/student';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '5') {
												this.returnUrl = returnUrl + '/parent';
											}
											//this.common.startSessionTime();
											// this.router.navigate([this.returnUrl]);
                      this.router.navigate([this.returnUrl])
                                              .then(() => {
                                                window.location.reload();
                                              });
										}
									});
								}
							});
						}
						this.loaderService.stopLoading();
					} else {
						this.loaderService.stopLoading();
						if (result.status === 'error' && result.data === 'token not matched') {
							this.common.showSuccessErrorMessage('Token Expired, Please enter a valid username and password', 'error');
						} else {
							this.common.showSuccessErrorMessage('Error Switching Account', 'error');
						}

						this.router.navigate(['/student/view-profile-student']);
					}
				},
				error => {
					this.common.showSuccessErrorMessage('Invalid username and password', 'error');
				});
	}





}
