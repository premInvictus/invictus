import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/index';
import { FpasswordService } from '../_services/fpassword.service';

@Component({
	selector: 'app-fpassword',
	templateUrl: './fpassword.component.html',
	styleUrls: ['./fpassword.component.css']
})

export class FpasswordComponent implements OnInit {
	forgotdiv = true;
	resetdiv = false;
	resendOTPActive = false;
	otpActive = true;
	emailActive = true;
	private otpdiv = false;
	private forgetPasswordForm: FormGroup;
	private validateOTPForm: FormGroup;
	private OTPstatus: any = {};
	constructor(
		private router: Router,
		private fbuild: FormBuilder,
		private notif: NotificationService,
		private fpasswordService: FpasswordService
	) { }

	ngOnInit() {
		this.buildForm();
		this.active_resend_otp();
	}

	active_resend_otp() {
		setTimeout(() => {
			this.resendOTPActive = true;
		}, 2000 * 60);
	}

	buildForm() {
		this.forgetPasswordForm = this.fbuild.group({
			username: ['', Validators],
			email: [''],
			mobile: ['', Validators.required]
		});
		this.validateOTPForm = this.fbuild.group({
			userotp: '',
			NewPassword: '',
			ConfirmPassword: ''
		});
	}

	otp_active() {
		this.otpActive = false;
		this.emailActive = true;
		this.forgetPasswordForm.controls.email.setValue('');
	}

	email_active() {
		this.otpActive = true;
		this.emailActive = false;
		this.forgetPasswordForm.controls.mobile.setValue('');
	}

	verifyforgot() {
		if (!this.otpActive && this.forgetPasswordForm.valid) {
			this.fpasswordService.getOTP(this.forgetPasswordForm.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.forgotdiv = false;
							this.resetdiv = true;
							this.notif.showSuccessErrorMessage(result.data, 'success');
						} else {
							this.notif.showSuccessErrorMessage(result.data, 'error');
						}
					}
				);
		} else if (!this.emailActive && this.forgetPasswordForm.valid) {
			this.fpasswordService.sendMail(this.forgetPasswordForm.value)
				.subscribe(
					(result: any) =>  {
						if (result && result.status === 'ok') {
							this.forgotdiv = false;
							this.notif.showSuccessErrorMessage(result.data, 'success');
						} else {
							this.notif.showSuccessErrorMessage(result.data, 'error');
						}
					}
				);
		}
	}

	validateotp() {
		const OtpFormData = {};
		OtpFormData['userotp'] = this.validateOTPForm.value.userotp;
		OtpFormData['username'] = this.forgetPasswordForm.value.username;
		this.fpasswordService.validateOTP(OtpFormData)
			.subscribe(
				(result: any) =>  {
					if (result && result.status === 'ok') {
						const data = result.data;
						const expiredate = new Date(data.otp_expire_date);
						const nowdate = new Date();
						if ((expiredate.getTime() - nowdate.getTime()) / 1000 * 60 * 60 > 0) {
							this.otpdiv = true;
						} else {
							this.notif.showSuccessErrorMessage('OTP Expired', 'error');
						}
					} else {
						this.notif.showSuccessErrorMessage(result.data, 'error');
					}
				}
			);
	}

	signIn() {
		this.router.navigate(['/login']);
	}

	resetPassword() {
		if (this.validateOTPForm.value.NewPassword === this.validateOTPForm.value.ConfirmPassword) {
			const psdata = {};
			psdata['username'] = this.forgetPasswordForm.value.username;
			psdata['password'] = this.validateOTPForm.value.NewPassword;
			this.fpasswordService.resetPassword(psdata).subscribe(
				(result: any) =>  {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage(result.data, 'success');
						this.router.navigate(['/login']);
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Password Mismatch', 'error');
		}
	}
}
