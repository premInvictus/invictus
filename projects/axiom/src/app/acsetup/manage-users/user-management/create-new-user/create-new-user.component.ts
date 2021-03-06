import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators, PatternValidator } from '@angular/forms';
import { QelementService } from '../../../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BreadCrumbService, NotificationService, UserAccessMenuService } from '../../../../_services/index';

@Component({
	selector: 'app-create-new-user',
	templateUrl: './create-new-user.component.html',
	styleUrls: ['./create-new-user.component.css']
})
export class CreateNewUserComponent implements OnInit {
	prefixStatusicon: string;
	prefixStatus: any;


	constructor(
		private router: Router,
		private userAccessMenuService: UserAccessMenuService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService) { }
	Cu_Form: FormGroup;
	userdetailArray: any[] = [];
	login_id: string;
	userDetails: any = {};
	loading = false;
	public role_id: any;
	homeUrl: string;
	userIdManageAccess: string;
	manageAccessFlag = true;
	updateFlag = false;
	mintoday: string;
	checkAvailable = false;
	events: string[] = [];

	au_email = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	au_mobile = new FormControl('', [Validators.required,
	]);
	au_full_name = new FormControl('', [Validators.required]);

	au_password = new FormControl('', [Validators.required]);
	au_dob = new FormControl('', [Validators.required]);


	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}

	ngOnInit() {
		this.buildForm();
		const param: any = {};
		this.login_id = this.route.snapshot.queryParams['login_id'];
		if (this.login_id) {
			param.au_role_id = '2';
			param.au_login_id = this.login_id;
			this.qelementService.getEditableUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.userDetails = {};
						this.userDetails = result.data[0];
						this.updateFlag = true;
						this.manageAccessFlag = false;
						this.userIdManageAccess = this.login_id;
						this.setUserForm(this.userDetails);
					}
				});
		} else {
			this.Cu_Form.patchValue({
				changepassword: true
			});
		}
	}
	changeAdminRightsValue($event) {
		if ($event.checked) {
			this.Cu_Form.patchValue({
				'au_non_teaching_staff_admin': '1'
			});
		} else {
			this.Cu_Form.patchValue({
				'au_non_teaching_staff_admin': '0'
			});
		}
	}

	buildForm() {
		this.Cu_Form = this.fbuild.group({

			au_full_name: '',
			au_username: '',
			au_password: '',
			au_mobile: '',
			au_email: '',
			au_dob: '',
			au_role_id: '2',
			up_allow_sms: '',
			up_allow_email: '',
			up_change_date: '',
			up_switch_tp: '',
			up_read_only: '',
			changepassword: '',
			au_non_teaching_staff_admin: '0'
		});

	}
	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.Cu_Form.value.au_dob, 'yyyy-MM-dd');
		this.Cu_Form.patchValue({
			'au_dob': convertedDate
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	activePasswordInput(event) {
		if (!event.checked) {
			this.Cu_Form.patchValue({
				'au_password': ''
			});
		}
	}

	addUser() {
		// form validation starts here
		if (!this.Cu_Form.value.au_full_name) {
			this.notif.showSuccessErrorMessage('FullName is Required', 'error');
		}
		if (!this.Cu_Form.value.au_username) {
			this.notif.showSuccessErrorMessage('Username is Required', 'error');
		}
		if (!this.Cu_Form.value.au_password) {
			this.notif.showSuccessErrorMessage('Password is Required', 'error');
		}
		if (!this.Cu_Form.value.au_mobile) {
			this.notif.showSuccessErrorMessage('Mobile Number is Required', 'error');
		}
		if (!this.Cu_Form.value.au_email) {
			this.notif.showSuccessErrorMessage('Email is Required', 'error');
		}
		if (!this.Cu_Form.value.au_dob) {
			this.notif.showSuccessErrorMessage('Dob is Required', 'error');
		}
		if (!this.Cu_Form.value.au_role_id) {
			this.notif.showSuccessErrorMessage('Access Level is Required', 'error');
		}
		// form Validation ends..

		if (this.Cu_Form.valid) {
			const newUserFormData: FormData = new FormData();
			newUserFormData.append('au_full_name', this.Cu_Form.value.au_full_name);
			newUserFormData.append('au_username', this.Cu_Form.value.au_username);
			newUserFormData.append('au_email', this.Cu_Form.value.au_email);
			newUserFormData.append('au_password', this.Cu_Form.value.au_password);
			newUserFormData.append('au_mobile', this.Cu_Form.value.au_mobile);
			newUserFormData.append('au_dob', this.Cu_Form.value.au_dob);
			newUserFormData.append('au_role_id', this.Cu_Form.value.au_role_id);
			newUserFormData.append('up_allow_sms', this.Cu_Form.value.up_allow_sms);
			newUserFormData.append('up_allow_email', this.Cu_Form.value.up_allow_email);
			newUserFormData.append('up_change_date', this.Cu_Form.value.up_change_date);
			newUserFormData.append('up_switch_tp', this.Cu_Form.value.up_switch_tp);
			newUserFormData.append('up_read_only', this.Cu_Form.value.up_read_only);
			newUserFormData.append('au_non_teaching_staff_admin', this.Cu_Form.value.au_non_teaching_staff_admin);
			const today: any = new Date().toJSON().split('T')[0];
			const date = '12-10-2004';
			const dateArray = date.split('-');
			const birth = this.Cu_Form.value.au_dob;
			const birthArray = birth.split('-');
			const birthDate = Number(birthArray[0]);
			const checkdate = today.split('-');
			const checkDateArray = Number(checkdate[0]);

			if (this.Cu_Form.value.au_dob < today && this.Cu_Form.value.au_dob !== today && checkDateArray - birthDate > 14) {
				this.qelementService.addUser(newUserFormData).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.userIdManageAccess = result.data.login_id;
							this.manageAccessFlag = false;
							if (result.data.url) {
								const xhr = new XMLHttpRequest();
								xhr.open('GET', result.data.url, true);
								xhr.send();
							}
							this.notif.showSuccessErrorMessage('User Created Successfully', 'success');
							this.router.navigate(['../manage-access-user', this.userIdManageAccess], { relativeTo: this.route });
							this.saveief();
						}
					}
				);
			} else {
				this.notif.showSuccessErrorMessage('Please enter correct dob', 'error');
			}
		} else {
			this.notif.showSuccessErrorMessage('Please enter all the required fields', 'error');
		}
		this.loading = false;


	}
	updateUser() {
		this.loading = true;
		if (!this.Cu_Form.value.au_full_name) {
			this.notif.showSuccessErrorMessage('FullName is Required', 'error');
		}
		if (!this.Cu_Form.value.au_username) {
			this.notif.showSuccessErrorMessage('Username is Required', 'error');
		}
		if (!this.Cu_Form.value.au_mobile) {
			this.notif.showSuccessErrorMessage('Mobile Number is Required', 'error');
		}
		if (!this.Cu_Form.value.au_email) {
			this.notif.showSuccessErrorMessage('Email is Required', 'error');
		}
		if (!this.Cu_Form.value.au_dob) {
			this.notif.showSuccessErrorMessage('Dob is Required', 'error');
		}
		if (!this.Cu_Form.value.au_role_id) {
			this.notif.showSuccessErrorMessage('Access Level is Required', 'error');
		}
		// form validation starts here
		if (this.Cu_Form.valid) {
			const newUserFormData = new FormData();
			newUserFormData.append('au_login_id', this.userDetails.au_login_id);
			newUserFormData.append('au_full_name', this.Cu_Form.value.au_full_name);
			newUserFormData.append('au_username', this.Cu_Form.value.au_username);
			newUserFormData.append('au_mobile', this.Cu_Form.value.au_mobile);
			newUserFormData.append('au_email', this.Cu_Form.value.au_email);
			newUserFormData.append('au_password', this.Cu_Form.value.au_password);
			newUserFormData.append('au_dob', this.Cu_Form.value.au_dob);
			newUserFormData.append('au_role_id', this.Cu_Form.value.au_role_id);
			newUserFormData.append('up_allow_sms', this.Cu_Form.value.up_allow_sms);
			newUserFormData.append('up_allow_email', this.Cu_Form.value.up_allow_email);
			newUserFormData.append('up_change_date', this.Cu_Form.value.up_change_date);
			newUserFormData.append('up_switch_tp', this.Cu_Form.value.up_switch_tp);
			newUserFormData.append('up_read_only', this.Cu_Form.value.up_read_only);
			newUserFormData.append('au_non_teaching_staff_admin', this.Cu_Form.value.au_non_teaching_staff_admin);
			newUserFormData.append('au_role_id', '2');

			const today: any = new Date().toJSON().split('T')[0];
			const birth = this.Cu_Form.value.au_dob;
			const birthArray = birth.split('-');
			const birthDate = Number(birthArray[0]);
			const checkdate = today.split('-');
			const checkDateArray = Number(checkdate[0]);
			if (this.Cu_Form.value.au_dob < today && this.Cu_Form.value.au_dob !== today && checkDateArray - birthDate > 14) {
				this.qelementService.updateUser(newUserFormData).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.userIdManageAccess = result.data.login_id;
							const url = result.data.url;
							this.loading = false;
							this.notif.showSuccessErrorMessage('User Updated Successfully', 'success');
							this.router.navigate(['../user-management'], { relativeTo: this.route });
						}
					}
				);
			} else {
				this.notif.showSuccessErrorMessage('Please enter correct dob', 'error');
			}
		} else {
			this.notif.showSuccessErrorMessage('User not Update', 'error');
		}
		this.loading = false;
	}

	saveief() {
		this.Cu_Form.reset();
	}
	setUserForm(value: any) {
		this.Cu_Form.patchValue({
			au_full_name: value.au_full_name,
			au_username: value.au_username,
			au_mobile: value.au_mobile,
			au_email: value.au_email,
			au_dob: value.au_dob,
			au_non_teaching_staff_admin: value.au_non_teaching_staff_admin
		});
		if (value.privileges.length > 0) {
			this.Cu_Form.patchValue({
				up_allow_sms: value.privileges[0].up_allow_sms === '1' ? true : false,
				up_allow_email: value.privileges[0].up_allow_email === '1' ? true : false,
				up_change_date: value.privileges[0].up_change_date === '1' ? true : false,
				up_switch_tp: value.privileges[0].up_switch_tp === '1' ? true : false,
				up_read_only: value.privileges[0].up_read_only === '1' ? true : false,
			});
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

}
