import { Component, OnInit } from '@angular/core';
import { CommonAPIService, ErpCommonService } from 'src/app/_services';
import { DomSanitizer } from '@angular/platform-browser';
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
  studentDet : any[]  = [];
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
  constructor(private common: CommonAPIService,
    public dom: DomSanitizer,
    private erp: ErpCommonService) { }

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
    this.erp.getStudent({ au_login_id: user.login_id, au_process_type: '4', last_class : true }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.studentdetails = res.data[0];
        this.parentDet = this.studentdetails.parentDetails && this.studentdetails.parentDetails.length > 0 ?
          this.studentdetails.parentDetails : [];
        this.sibDet = this.studentdetails.personalDetails && this.studentdetails.personalDetails.length > 0
          && this.studentdetails.personalDetails[0].siblingDetails && this.studentdetails.personalDetails[0].siblingDetails.length > 0
          ? this.studentdetails.personalDetails[0].siblingDetails : [];
        this.addressDetails = this.studentdetails.personalDetails && this.studentdetails.personalDetails.length > 0
          && this.studentdetails.personalDetails[0].addressDetails && this.studentdetails.personalDetails[0].addressDetails.length > 0
          ? this.studentdetails.personalDetails[0].addressDetails[0] : [];
          this.studentDet.push({au_class_id : this.studentdetails.au_class_id});
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
		this.erp.getAdditionalDetails({ au_login_id: this.currentUser.login_id }).subscribe((result: any) => {
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
}
