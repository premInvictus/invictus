import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BreadCrumbService } from '../../../../_services/breadcrumb.service';
import { UserAccessMenuService } from '../../../../_services/userAccessMenu.service';
import { appConfig } from '../../../../app.config';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SearchStudentComponent } from './search-student/search-student.component';
import { CommonAPIService } from '../../../../_services';


@Component({
	selector: 'app-view-student-profile',
	templateUrl: './view-student-profile.component.html',
	styleUrls: ['./view-student-profile.component.css']
})
export class ViewStudentProfileComponent implements OnInit {
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
	homeUrl: string;
	login_id: string;
	userDetails: any = {};
	updateFlag = false;
	studentArrayByName: any[] = [];
	dialogRef: MatDialogRef<SearchStudentComponent>;
	url: any = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';


	constructor(
		private dialog: MatDialog,
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private service: CommonAPIService,
		private route: ActivatedRoute,
		private router: Router,
		private notif: NotificationsService) { }

	ngOnInit() {
		this.getAllUser();
		this.buildForm();
		this.getSchool();
		this.getClass();
		this.homeUrl = this.breadCrumbService.getUrl();
		this.login_id = this.route.snapshot.queryParams['login_id'];

		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '4';
			param.login_id = this.login_id;
			this.getuserDetail(param);
		}
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
							if (Number(this.userArray[ti].au_login_id) === Number(this.login_id)) {
								console.log('yes');
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
					this.url = '';
					if (result.data.length > 0) {
						this.updateFlag = true;
						this.userDetails = result.data[0];
						const userPersonalDetail = this.userDetails.personal_details ? this.userDetails.personal_details[0] : '';
						this.Student_Details_Form.patchValue({
							au_login_id: this.userDetails.au_admission_no,
							au_full_name: this.userDetails.au_full_name,
							au_username: this.userDetails.au_username,
							au_email: this.userDetails.au_email,
							au_mobile: this.userDetails.au_mobile,
							au_profileimage: this.userDetails.au_profileimage,
							au_class_id: this.userDetails.au_class_id,
							au_sec_id: this.userDetails.au_sec_id,
							upd_gender: userPersonalDetail ? userPersonalDetail.upd_gender : ''
						}),
							this.getSectionsByClass();
						if (this.userDetails.personal_details.length > 0) {
							if (userPersonalDetail.upd_gender === 'M') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
							} else if (userPersonalDetail.upd_gender === 'F') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
							} else if (userPersonalDetail.upd_gender === 'O') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
							}
						} else {
							this.url = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
						}
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
		console.log(nextStudentLoginIndex);
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
			au_profileimage: new FormControl({}),
			au_username: '',
			au_login_id: '',
			au_full_name: '',
			au_mobile: '',
			au_email: '',
			au_role_id: '4',
			au_class_id: '',
			au_sec_id: '',
			upd_gender: '',
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
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
		this.qelementService.getSectionsByClass(this.Student_Details_Form.value.au_class_id).subscribe(
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
		const param: any = {};
		param.role_id = '4';
		param.status = '1';
		param.full_name = name;
		this.getAllStudentListByName(param);
	}

	saveief() {
		this.Student_Details_Form.controls.au_full_name.setValue('');
		this.Student_Details_Form.controls.au_email.setValue('');
		this.Student_Details_Form.controls.au_username.setValue('');
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

	searchStudent(): void {
		const dialogRef = this.dialog.open(SearchStudentComponent, {
			width: '100vh',
			height: '50%',
			data: {}
		});
		dialogRef.afterClosed().subscribe((res: any) => {
			if (res) {
				this.router.navigate(['../view-student-profile'],
					{ queryParams: { login_id: res.login_id }, relativeTo: this.route });
				const param: any = {};
				param.role_id = '4';
				param.login_id = res.login_id;
				this.getuserDetail(param);
			}
		});
	}
	goBack() {
		this.router.navigate(['../student-management'], { relativeTo: this.route });
	}
}
