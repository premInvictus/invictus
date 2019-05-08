import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService, BreadCrumbService } from '../../_services/index';
import { AdminService } from '../admin/services/admin.service';
import { QelementService } from '../../questionbank/service/qelement.service';
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

	constructor(
		private router: Router,
		private fbuild: FormBuilder,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private adminService: AdminService,
		private qelementService: QelementService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
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

		if (this.user_credential_form.valid &&
			this.user_credential_form.value.confirm_password === this.user_credential_form.value.new_password) {
			this.adminService.reset_password({
				oldPassword: this.user_credential_form.value.old_password,
				username: this.currentUserDetail.au_username,
				loginId: this.currentUser.login_id, password: this.user_credential_form.value.new_password
			}).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Password Changed Successfully', 'success');
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
