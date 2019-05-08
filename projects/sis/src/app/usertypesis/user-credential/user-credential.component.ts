import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonAPIService } from '../../_services/index';
import { ManageUsersService } from './../../manage-users/service/manage-users.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-user-credential',
	templateUrl: './user-credential.component.html',
	styleUrls: ['./user-credential.component.scss']
})
export class UserCredentialComponent implements OnInit {

	user_credential_form: FormGroup;
	hide = true;
	visible = true;
	homeUrl: string;
	confirmmismatch = false;
	currentUser: any = {};
	currentUserDetail: any = {};

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private fbuild: FormBuilder,
		private notif: CommonAPIService,
		private manageUsersService: ManageUsersService
	) { }

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.manageUsersService.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id }).subscribe(
			(result: any) => {
				if (result) {
					this.currentUserDetail = result.data[0];
				}
			}
		);

	}

	buildForm() {
		this.user_credential_form = this.fbuild.group({
			old_password: '',
			new_password: '',
			confirm_password: ''
		});
	}

	Changepassword() {
		if (!this.user_credential_form.value.old_password) {
			this.notif.showSuccessErrorMessage('Old password is Required', 'error');
		}
		if (!this.user_credential_form.value.new_password) {
			this.notif.showSuccessErrorMessage('New passowrd is Required', 'error');
		}
		if (!this.user_credential_form.value.confirm_password) {
			this.notif.showSuccessErrorMessage('Confirm password is required', 'error');
		}
		if (this.user_credential_form.value.confirm_password !== this.user_credential_form.value.new_password) {
			this.notif.showSuccessErrorMessage('Confirm Password Mismatch', 'error');
		}

		if (this.user_credential_form.valid) {
			this.manageUsersService.reset_password({
				oldPassword: this.user_credential_form.value.old_password,
				username: this.currentUserDetail.au_username,
				loginId: this.currentUser.login_id, password: this.user_credential_form.value.new_password
			}).subscribe(
				(result: any) => {
					if (result) {
						this.notif.showSuccessErrorMessage('Password Changed Successfully', 'success');
						this.router.navigate(['/login']);
					}
				}
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
