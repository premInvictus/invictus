import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from '../../_services/index';
import {Router} from '@angular/router';
@Component({
	selector: 'app-user-credential',
	templateUrl: './user-credential.component.html',
	styleUrls: ['./user-credential.component.css']
})
export class UserCredentialComponent implements OnInit {

	user_credential_form: FormGroup;
	hide = true;
	visible = true;
	homeUrl: string;
	confirmmismatch = false;
	currentUser: any = {};
	currentUserDetail: any = {};
	usernameText = '';
	isUserAvailable = false;

	constructor(
		private router: Router,
		private fbuild: FormBuilder,
		private erpCommonService: ErpCommonService,
		private common: CommonAPIService
	) { }

	ngOnInit() {
		this.homeUrl = this.common.getUrl();
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.erpCommonService.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.currentUserDetail = result.data[0];
					if(this.currentUserDetail.au_changeusername == '1') {
						this.user_credential_form.patchValue({
							new_username: this.currentUserDetail.au_username
						});
					}
				}
			}
		);

	}

	buildForm() {
		this.user_credential_form = this.fbuild.group({
			old_password: '',
			new_password: '',
			confirm_password: '',
			new_username: ''
		});
	}

	Changepassword() {
		if (!this.user_credential_form.value.old_password) {
			this.common.showSuccessErrorMessage('Old password is Required', 'error');
		}
		if (!this.user_credential_form.value.new_password) {
			this.common.showSuccessErrorMessage('New passowrd is Required', 'error');
		}
		if (!this.user_credential_form.value.confirm_password) {
			this.common.showSuccessErrorMessage('Confirm password is required', 'error');
		}
		if (this.user_credential_form.value.confirm_password !== this.user_credential_form.value.new_password) {
			this.common.showSuccessErrorMessage('Confirm Password Mismatch', 'error');
		}

		if (this.user_credential_form.valid &&
			this.user_credential_form.value.confirm_password === this.user_credential_form.value.new_password) {
			this.erpCommonService.reset_password({
				oldPassword: this.user_credential_form.value.old_password,
				username: this.currentUserDetail.au_username,
				loginId: this.currentUser.login_id, password: this.user_credential_form.value.new_password
			}).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage('Password Changed Successfully', 'success');
						if (this.currentUser.role_id === '1') {
							this.router.navigateByUrl('axiom/admin');
						} else if (this.currentUser.role_id === '2') {
							this.router.navigateByUrl('axiom/school');
						} else if (this.currentUser.role_id === '3') {
							this.router.navigateByUrl('axiom/teacher');
						} else {
							this.router.navigateByUrl('axiom/student');
						}
					}
				}
			);
		}
	}
	checkUserExists() {
		console.log(this.user_credential_form.value.new_username);
		if (this.user_credential_form.value.new_username) {
			this.erpCommonService.checkUserStatus({ user_name: this.user_credential_form.value.new_username }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.usernameText = result.data;
					this.isUserAvailable = true;
				} else {
					this.usernameText = result.data;
					this.isUserAvailable = false;
				}
			});
		}
	}
	changeUsername() {
		if(this.isUserAvailable) {
			this.erpCommonService.changeUserStatus({ au_login_id: this.currentUser.login_id, au_username: this.user_credential_form.value.new_username }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.data, 'success');
					} else {
						this.common.showSuccessErrorMessage(result.data, 'error');
					}
				},
			);
		}
	}
	resetpassword() {
		this.user_credential_form.setValue(
			{
				old_password: '',
				new_password: '',
				confirm_password: ''
			}
		);
	}
	checkMismatch() {
		if (this.user_credential_form.value.confirm_password !== this.user_credential_form.value.new_password) {
			this.confirmmismatch = true;
		}
	}
}
