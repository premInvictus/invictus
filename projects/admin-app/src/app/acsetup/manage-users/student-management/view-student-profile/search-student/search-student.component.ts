import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup , FormBuilder } from '@angular/forms';
import { QelementService } from '../../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { CommonAPIService } from 'projects/axiom/src/app/_services';

@Component({
	selector: 'app-search-student',
	templateUrl: './search-student.component.html',
	styleUrls: ['./search-student.component.css']
})
export class SearchStudentComponent implements OnInit {


	Student_Details_Form: FormGroup;
	Personal_detail_Form: FormGroup;
	Parents_Form: FormGroup;
	Guardian_Form: FormGroup;
	Siblings_Form: FormGroup;
	Accounts_Form: FormGroup;
	Education_Form: FormGroup;
	Skills_Form: FormGroup;
	Parent_Remarks_Form: FormGroup;
	Interviewer_Remarks_Form: FormGroup;
	currentStudentLoginIndex: number;
	Documents_Form: FormGroup;
	hosturl = appConfig.apiUrl;
	Reamrk_Form: FormGroup;
	userArray: any[] = [];
	classArray: any[] = [];
	schoolinfoArray: any = {};
	sectionArray: any[] = [];
	stateArray: any[] = [];
	cityArray: any[] = [];
	loading = false;
	public role_id: any;
	searchStudent = false;
	homeUrl: string;
	login_id: string;
	userDetails: any = {};
	updateFlag = false;
	studentArrayByName: any[] = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) private data,
		public dialogRef: MatDialogRef<SearchStudentComponent>,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private service: CommonAPIService,
		private router: Router,
		private notif: NotificationsService, ) { }

	ngOnInit() {
		this.getAllUser();

		this.login_id = this.route.snapshot.queryParams['login_id'];

		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '4';
			param.login_id = this.login_id;
			this.getuserDetail(param);

		}
		this.buildForm();
		this.getSchool();
		this.getClass();
	}

	getAllUser() {
		const param: any = {};
		param.role_id = '4';
		param.status = 1;
		this.loading = true;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.userArray = result.data;
					if (this.userArray.length > 0) {
						for (let ti = 0; ti < this.userArray.length; ti++) {
							if (this.userArray[ti].au_login_id === this.login_id) {
								this.currentStudentLoginIndex = ti;
								break;
							}
						}
					} else {
						this.notif.error(
							'Error',
							'No Record Found',
							{
								timeOut: 2000,
								showProgressBar: true,
								pauseOnHover: false,
								clickToClose: true,
								maxLength: 50
							}
						);
					}
				} else {
					this.userArray = [];
					this.loading = false;
				}
			},
			error => {
				this.loading = false;
			}
		);
	}



	getuserDetail(param) {
		this.loading = true;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					if (result.data.length > 0) {
						this.userDetails = result.data[0];
						this.Student_Details_Form.controls.au_login_id.setValue(this.userDetails.au_login_id);
						this.Student_Details_Form.controls.au_full_name.setValue(this.userDetails.au_full_name);
						this.Student_Details_Form.controls.au_email.setValue(this.userDetails.au_email);
						this.Student_Details_Form.controls.au_mobile.setValue(this.userDetails.au_mobile);
						this.Personal_detail_Form.controls.au_class_id.setValue(this.userDetails.au_class_id);
						this.getSectionsByClass();
						this.Personal_detail_Form.controls.au_sec_id.setValue(this.userDetails.au_sec_id);
						this.Personal_detail_Form.controls.upd_aadhaar_no.setValue(this.userDetails.personal_details[0].upd_aadhaar_no);
						this.Personal_detail_Form.controls.upd_dob.setValue(this.userDetails.personal_details[0].upd_dob);
						this.Personal_detail_Form.controls.upd_gender.setValue(this.userDetails.personal_details[0].upd_gender);
						this.Personal_detail_Form.controls.upd_doj.setValue(this.userDetails.personal_details[0].upd_doj);
						this.Personal_detail_Form.controls.upd_address.setValue(this.userDetails.personal_details[0].upd_address);
						this.Personal_detail_Form.controls.upd_cit_id.setValue(this.userDetails.personal_details[0].upd_cit_id);
						this.Personal_detail_Form.controls.upd_sta_id.setValue(this.userDetails.personal_details[0].upd_sta_id);
						this.Personal_detail_Form.controls.upd_pincode.setValue(this.userDetails.personal_details[0].upd_pincode);
						this.updateFlag = true;
					} else {
						this.errorNotification('No record found');
					}
				} else {
					this.loading = false;
					this.errorNotification('No record found');
				}
			},
			error => {
				this.loading = false;
			}
		);
	}

	getStudentDetail(nextStudentLoginIndex) {
		if (nextStudentLoginIndex > -1 && nextStudentLoginIndex < this.userArray.length) {
			this.currentStudentLoginIndex = nextStudentLoginIndex;
			// tslint:disable-next-line:max-line-length
			this.router.navigate(['../view-student-profile'], { queryParams: { login_id: this.userArray[this.currentStudentLoginIndex].au_login_id }, relativeTo: this.route });
			const param: any = {};
			param.role_id = '4';
			param.login_id = this.userArray[this.currentStudentLoginIndex].au_login_id;
			this.getuserDetail(param);
		}

	}
	getStudentByloginid(value) {
		const param: any = {};
		param.role_id = '4';
		param.login_id = value;
		this.router.navigate(['../view-student-profile'], { queryParams: { login_id: value }, relativeTo: this.route });
		this.getuserDetail(param);
	}

	buildForm() {
		this.Student_Details_Form = this.fbuild.group({
			au_profileimage: '',
			au_login_id: '',
			au_full_name: '',
			au_mobile: '',
			au_email: '',
			au_role_id: '4',

		});
		this.Personal_detail_Form = this.fbuild.group({
			au_class_id: '',
			au_sec_id: '',
			upd_aadhaar_no: '',
			upd_dob: '',
			upd_gender: '',
			upd_doj: '',
			upd_address: '',
			upd_cit_id: '',
			upd_sta_id: '',
			upd_pincode: ''

		});

		this.Parents_Form = this.fbuild.group({
			au_email: '',
			au_full_name: '',
			upd_school_alumni: '',
			upd_last_class: '',
			upd_last_year: '',
			upd_spouse_education: '',
			upd_spouse_occupation: '',
			upd_spouse_designation: '',
			au_mobile: '',
			upd_address: ''
		});

		this.Guardian_Form = this.fbuild.group({
			au_full_name: '',
			upd_guardian_relationship: '',
			upd_spouse_education: '',
			upd_spouse_occupation: '',
			upd_spouse_designation: '',
			au_mobile: '',
			au_email: '',
			upd_addresss: ''
		});

		this.Siblings_Form = this.fbuild.group({
			usr_id: '',
			au_full_name: '',
			uc_class_id: '',
			uc_sec_id: '',

		});
		this.Accounts_Form = this.fbuild.group({
			uad_id: '',
			uad_concession_category: '',
			uad_fee_cycle: '',
			ts_id: '',
			tr_id: '',
			tsp_tr_id: '',
			tsp_stop: ''
		});
		this.Education_Form = this.fbuild.group({
			au_si_prefix: '',
			ue_to_date: '',
			upd_last_year: '',
			upd_last_class: '',
			ue_from_date: '',
		});
		this.Skills_Form = this.fbuild.group({
			ua_activity: '',
			ya_interest: '',
			ua_created_date: '',
		});
		this.Parent_Remarks_Form = this.fbuild.group({



		});

		this.Interviewer_Remarks_Form = this.fbuild.group({
			ur_marks: '',
			ur_interviewer: '',

		});

		this.Documents_Form = this.fbuild.group({
			au_dob: '',
			au_si_prefix: '',
			au_examination_report: '',
			au_bg: '',
			au_profileimage: '',
			upd_aadhaar_no: '',
			upd_id: '',
			upd_assessment: '',
			ur_other: '',

		});

		this.Reamrk_Form = this.fbuild.group({
			ur_references: '',
			ur_appraisal: '',
			ur_interviewer: '',
			ur_other: '',
		});

	}


	getSchool() {
		this.loading = true;
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.schoolinfoArray = result.data[0];
				}
			},
		);

		this.loading = false;
	}

	errorNotification(msg) {
		this.notif.error(
			'Error',
			msg,
			{
				timeOut: 2000,
				showProgressBar: true,
				pauseOnHover: false,
				clickToClose: true,
				maxLength: 50
			}
		);
	}

	successNotification(msg) {
		this.notif.success(
			'Success',
			msg,
			{
				timeOut: 2000,
				showProgressBar: true,
				pauseOnHover: false,
				clickToClose: true,
				maxLength: 50
			}
		);
	}


	getClass() {
		this.loading = true;
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.classArray = result.data;
				}
			},
		);
		this.loading = false;
	}

	getSectionsByClass(): void {
		this.loading = true;
		this.qelementService.getSectionsByClass(this.Personal_detail_Form.value.au_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			},
		);
		this.loading = false;
	}




	// Update user for Student


	getState() {
		this.loading = true;
		this.qelementService.getState().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.stateArray = result.data;
				}
			},
		);
		this.loading = false;
	}

	getCity() {
		this.loading = true;
		this.qelementService.getCity().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.cityArray = result.data;
				}
			},
		);
		this.loading = false;
	}
	getAllStudentListByName(param) {
		this.loading = true;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.loading = false;
					this.studentArrayByName = result.data;

				} else {
					this.studentArrayByName = [];
					this.notif.error(
						'Error',
						'No Record Found',
						{
							timeOut: 2000,
							showProgressBar: true,
							pauseOnHover: false,
							clickToClose: true,
							maxLength: 50
						}
					);
					this.loading = false;
				}
			},
			error => {
				this.loading = false;
			}
		);
	}


	searchStudentByName(name) {
		this.searchStudent = true;
		const param: any = {};
		param.role_id = '4';
		param.status = '1';
		param.full_name = name;
		this.getAllStudentListByName(param);
	}
	routeToStudentPage(id) {
		this.service.viewProfile.next(id);
		this.dialogRef.close();
	}

	saveief() {
		this.Student_Details_Form.controls.au_full_name.setValue('');
		this.Student_Details_Form.controls.au_email.setValue('');
		this.Student_Details_Form.controls.au_mobile.setValue('');
		this.Personal_detail_Form.controls.au_class_id.setValue('');
		this.Personal_detail_Form.controls.au_sec_id.setValue('');
		this.Personal_detail_Form.controls.upd_aadhaar_no.setValue('');
		this.Personal_detail_Form.controls.upd_dob.setValue('');
		this.Personal_detail_Form.controls.upd_gender.setValue('');
		this.Personal_detail_Form.controls.upd_doj.setValue('');
		this.Personal_detail_Form.controls.upd_address.setValue('');
		this.Personal_detail_Form.controls.upd_cit_id.setValue('');
		this.Personal_detail_Form.controls.upd_sta_id.setValue('');
		this.Personal_detail_Form.controls.upd_pincode.setValue('');
	}
	closeDialog(): void {
		this.dialogRef.close();
	}
}
