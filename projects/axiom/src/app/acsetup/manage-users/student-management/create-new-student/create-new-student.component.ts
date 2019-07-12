import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService, UserAccessMenuService, NotificationService } from '../../../../_services/index';
import { appConfig } from '../../../../app.config';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';



@Component({
	selector: 'app-create-new-student',
	templateUrl: './create-new-student.component.html',
	styleUrls: ['./create-new-student.component.css']
})
export class CreateNewStudentComponent implements OnInit {
	constructor(
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService,
		private fbuild: FormBuilder,
		private router: Router,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private notif: NotificationService) { }
	checkAvailable = false;
	prefixStatusicon: string;
	prefixStatus: any;
	Student_Details_Form: FormGroup;
	Personal_detail_Form: FormGroup;
	Parents_Form: FormGroup;
	Guardian_Form: FormGroup;
	Siblings_Form: FormGroup;
	Accounts_Form: FormGroup;
	Education_Form: FormGroup;
	hosturl = appConfig.apiUrl;
	Skills_Form: FormGroup;
	Interviewer_Remarks_Form: FormGroup;
	Documents_Form: FormGroup;
	Reamrk_Form: FormGroup;
	classArray: any[] = [];
	schoolinfoArray: any = {};
	sectionArray: any[] = [];
	stateArray: any[] = [];
	cityArray: any[] = [];
	homeUrl: string;
	loading = false;
	login_id: string;
	userDetails: any = {};
	updateFlag = false;
	url: any = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
	mintoday: string;
	events: string[] = [];
	private file1: File;
	setLoginId: any;

	au_email = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	au_mobile = new FormControl('', [Validators.required,
	]);
	upd_dob = new FormControl('', [Validators.required]);
	au_full_name = new FormControl('', [Validators.required]);
	upd_aadhaar_no = new FormControl('', [Validators.required]);
	upd_gender = new FormControl('', [Validators.required]);
	upd_pincode = new FormControl('', [Validators.required]);

	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}

	ngOnInit() {
		this.buildForm();
		this.getSchool();
		this.getClass();
		this.homeUrl = this.breadCrumbService.getUrl();
		this.login_id = this.route.snapshot.queryParams['login_id'];
		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '4';
			param.login_id = this.login_id;
			this.qelementService.getUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.updateFlag = true;
						this.userDetails = result.data[0];
						this.setLoginId = this.userDetails.au_login_id;
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
						if (this.userDetails.personal_details) {
							if (userPersonalDetail.upd_gender === 'M') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
							} else if (userPersonalDetail.upd_gender === 'F') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.svg';
							} else if (userPersonalDetail.upd_gender === '0') {
								this.url = this.userDetails.au_profileimage ? this.userDetails.au_profileimage :
									'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
							}
						}
					}
				});
		}
	}

	buildForm() {
		this.Student_Details_Form = this.fbuild.group({
			au_login_id: '',
			au_profileimage: new FormControl({}),
			au_full_name: '',
			au_username: '',
			au_mobile: '',
			au_email: '',
			au_process_type: '4',
			au_role_id: '4',
			au_class_id: '',
			au_sec_id: '',
			upd_gender: ''
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.Personal_detail_Form.value.upd_dob, 'yyyy-MM-dd');
		this.Personal_detail_Form.patchValue({
			'upd_dob': convertedDate
		});
	}

	addDate(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDoj = datePipe.transform(this.Personal_detail_Form.value.upd_doj, 'yyyy-MM-dd');
		this.Personal_detail_Form.patchValue({
			'upd_doj': convertedDoj
		});
	}

	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			},
		);
	}
	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			},
		);
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.Student_Details_Form.value.au_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			},
		);
	}


	// Add Student details
	studentForm() {
		if (this.Student_Details_Form.valid) {
			const newStudentFormData = new FormData();
			// Call to the service to addUser
			newStudentFormData.append('au_profileimage', this.file1);
			newStudentFormData.append('au_full_name', this.Student_Details_Form.value.au_full_name);
			newStudentFormData.append('au_username', this.Student_Details_Form.value.au_username);
			newStudentFormData.append('au_mobile', this.Student_Details_Form.value.au_mobile);
			newStudentFormData.append('au_email', this.Student_Details_Form.value.au_email);
			newStudentFormData.append('au_class_id', this.Student_Details_Form.value.au_class_id);
			newStudentFormData.append('au_sec_id', this.Student_Details_Form.value.au_sec_id);
			newStudentFormData.append('upd_gender', this.Student_Details_Form.value.upd_gender);
			newStudentFormData.append('au_role_id', '4');
			newStudentFormData.append('au_process_type', '4');
			this.qelementService.addUser(newStudentFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.login_id = result.data.login_id;
						if (result.data.url) {
							const xhr = new XMLHttpRequest();
							xhr.open('GET', result.data.url, true);
							xhr.send();
						}
						this.notif.showSuccessErrorMessage('Success,Student Added Successfully', 'success');
						this.backUrl();
					}

				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please enter all the required fields', 'error');
		}
	}
	backUrl() {
		history.back();
	}
	// End Add Student details

	// Update user for Student
	updateUser() {
		// this.loading = true;
		if (this.Student_Details_Form.valid) {
			const newStudentFormData = new FormData();
			if (this.file1) {
				newStudentFormData.append('au_profileimage', this.file1);
			}
			newStudentFormData.append('au_login_id', this.setLoginId);
			newStudentFormData.append('au_full_name', this.Student_Details_Form.value.au_full_name);
			newStudentFormData.append('au_username', this.Student_Details_Form.value.au_username);
			newStudentFormData.append('au_mobile', this.Student_Details_Form.value.au_mobile);
			newStudentFormData.append('au_email', this.Student_Details_Form.value.au_email);
			newStudentFormData.append('au_class_id', this.Student_Details_Form.value.au_class_id);
			newStudentFormData.append('au_sec_id', this.Student_Details_Form.value.au_sec_id);
			newStudentFormData.append('upd_gender', this.Student_Details_Form.value.upd_gender);
			newStudentFormData.append('au_role_id', '4');
			this.qelementService.updateUser(newStudentFormData).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.loading = false;
						this.notif.showSuccessErrorMessage('Updated Successfully', 'success');
						this.router.navigate(['../student-management'], { relativeTo: this.route });

					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please enter all the required fields', 'error');
			this.loading = false;
		}
	}

	// Update user for Student
	saveief() {
		this.Student_Details_Form.patchValue({ au_full_name: '', au_email: '', au_mobile: '', au_class_id: '', au_sec_id: '' });
	}

	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();
			reader.onload = (eventObj: any) => {
				this.url = eventObj.target.result;
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	uploadStudentImage(event) {
		if (event.target.files.length > 0) {
			this.file1 = event.target.files[0];
		}
	}
	checkUserExists(value) {
		if (value) {
			this.qelementService.checkUserStatus({ user_name: value }).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.checkAvailable = true;
					this.prefixStatusicon = 'fas fa-check text-success';
					this.prefixStatus = res.data;
				} else {
					this.checkAvailable = false;
					this.prefixStatusicon = 'fas fa-times text-danger';
					this.prefixStatus = res.data;
				}
			});
		}
	}
	hideIcon() {
		this.prefixStatus = '';
	}
	changeUrl($event) {
		if ($event.value === 'M') {
			this.url = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
		} else if ($event.value === 'F') {
			this.url = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.svg';
		} else if ($event.value === 'O') {
			this.url = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
		} else {
			this.url = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
		}
	}
}
