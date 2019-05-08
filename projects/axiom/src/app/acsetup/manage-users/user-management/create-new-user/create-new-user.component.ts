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
		this.login_id = this.route.snapshot.queryParams['login_id'];
		if (this.route.snapshot.queryParams['login_id']) {
			const param: any = {};
			param.role_id = '2';
			param.login_id = this.login_id;
			this.qelementService.getUser(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data.length === 1) {
							this.userDetails = result.data[0];
							this.updateFlag = true;
							this.manageAccessFlag = false;
							this.userIdManageAccess = this.login_id;
							this.setUserForm(this.userDetails);
						}
					} else {
					}
				});
		}
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
	}

	buildForm() {
		this.Cu_Form = this.fbuild.group({

			au_full_name: '',
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

	addUser() {
		// form validation starts here
		if (!this.Cu_Form.value.au_full_name) {
			this.notif.showSuccessErrorMessage('FullName is Required', 'error');
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
							this.router.navigate(['/school/setup/manage-access-user', this.userIdManageAccess]);
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
	setUserForm(value) {
		this.Cu_Form.controls.au_full_name.setValue(value.au_full_name);
		this.Cu_Form.controls.au_email.setValue(value.au_email);
		this.Cu_Form.controls.au_mobile.setValue(value.au_mobile);
		// this.Cu_Form.controls.au_password.setValue(value.au);
		this.Cu_Form.controls.au_dob.setValue(value.au_dob);
		this.Cu_Form.controls.au_role_id.setValue(value.au_role_id);
		this.Cu_Form.controls.up_allow_sms.setValue(value.privileges[0].up_allow_sms === '1' ? true : false);
		this.Cu_Form.controls.up_allow_email.setValue(value.privileges[0].up_allow_email === '1' ? true : false);
		this.Cu_Form.controls.up_change_date.setValue(value.privileges[0].up_change_date === '1' ? true : false);
		this.Cu_Form.controls.up_switch_tp.setValue(value.privileges[0].up_switch_tp === '1' ? true : false);
		this.Cu_Form.controls.up_read_only.setValue(value.privileges[0].up_read_only === '1' ? true : false);
	}

}
