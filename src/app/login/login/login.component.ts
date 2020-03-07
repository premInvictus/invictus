﻿import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAPIService, MessagingService } from '../../_services/index';
import { AuthenticationService } from '../login/authentication.service';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { tokenKey } from '@angular/core/src/view';

@Component({
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.scss'],
	providers: [CookieService]
})
export class LoginComponent implements OnInit {
	LoginForm: FormGroup;
	model: any = {};
	returnUrl: string;
	loginCard = true;
	forgotPassword = false;
	forgotPasswordMobile = false;
	forgotPasswordEmail = false;

	/* Forgot Password */

	forgotdiv = true;
	resetdiv = false;
	resendOTPActive = false;
	otpActive = true;
	emailActive = true;
	device_details: any[] = [{ device_id: "", "platform": "web", type: "web" }, { device_id: "", "platform": "android", type: "app" }];
	verifyOtp = false;
	newPassword = false;
	private otpdiv = false;
	sessionArray: any[] = [];
	currentSessionId: any;
	currentDate = new Date();
	private forgetPasswordForm: FormGroup;
	private validateOTPForm: FormGroup;
	private validateNewPasswordForm: FormGroup;
	schoolInfo: any = {};
	userSaveData: any;
	webDeviceToken: any = {};
	private OTPstatus: any = {};

	/*Forgot passwrd Ends*/

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private notif: CommonAPIService,
		private fpasswordService: AuthenticationService,
		private loaderService: CommonAPIService,
		private messagingService: MessagingService,
		private fbuild: FormBuilder,
		private _cookieService: CookieService
	) {
		if (_cookieService.get('remember')) {
			this.model.username = this._cookieService.get('username');
			this.model.password = this._cookieService.get('password');
			this.model.rememberme = this._cookieService.get('rememberme');
		}
	}

	ngOnInit() {
		// reset login status
		// this.authenticationService.logout();
		// get return url from route parameters or default to '/'
		this.messagingService.requestPermission();
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
		this.buildForm();
		this.checkLoginStatus();
		this.active_resend_otp();
	}
	checkLoginStatus() {
		const cookieData = this.getCookie('userData');
		if (cookieData) {
			const userData = JSON.parse(decodeURIComponent(cookieData));
			if (userData) {
				if (userData['UR'] === '1') {
					this.returnUrl = '/admin';
				} else if (userData['UR'] === '2') {
					if (localStorage.getItem('project')) {
						this.returnUrl = '/' + JSON.parse(localStorage.getItem('project')).pro_url + '/school';
					}
				} else if (userData['UR'] === '3') {
					this.returnUrl = '/teacher';
				} else if (userData['UR'] === '4') {
					this.returnUrl = '/student';
				} else if (userData['UR'] === '5') {
					this.returnUrl = '/parent';
				}
				this.router.navigate([this.returnUrl]);
			}
		}

	}
	private getCookie(name) {
		const value = '; ' + document.cookie;
		const parts = value.split('; ' + name + '=');
		if (parts.length === 2) { return parts.pop().split(';').shift(); }
	}

	changepassword() {
		this.loginCard = false;
		this.forgotPassword = true;
		this.forgotPasswordMobile = true;
		this.forgotPasswordEmail = false;
	}

	changeToEmail() {
		this.forgotPasswordEmail = true;
		this.forgotPasswordMobile = false;
	}

	changeToMobile() {
		this.forgotPasswordEmail = false;
		this.forgotPasswordMobile = true;
	}

	backtologin() {
		this.loginCard = true;
		this.forgotPassword = false;
	}

	login(event) {
		if (Number(event.keyCode) === 13) {
			event.stopPropagation();
			return false;
		}
		this._cookieService.put('username', this.model.username);
		this._cookieService.put('password', this.model.password);
		this._cookieService.put('remember', this.model.rememberme);
		if (localStorage.getItem("web-token")) {
		this.webDeviceToken = JSON.parse(localStorage.getItem("web-token"));
		}
		this.authenticationService.login(this.model.username, this.model.password, this.webDeviceToken['web-token'], 'web')
			.subscribe(
				(result: any) => {
					if (result.status === 'ok' && result.data) {
						this.loaderService.stopLoading();
						const user = result.data;
						if (result.data.userSaveStateData) {
							this.userSaveData = JSON.parse(result.data.userSaveStateData);
						}
						const tempJson = {
							CID: user.clientKey,
							AN: user.token,
							UR: user.role_id,
							LN: user.login_id,
							PF: user.Prefix
						};
						// user.Prefix = this.model.username.split('-')[0];
						// user.username = this.model.username;
						if (user) {
							localStorage.setItem('currentUser', JSON.stringify(user));
							this._cookieService.put('userData', JSON.stringify(tempJson));
						}
						if (this._cookieService.get('userData')) {
							this.notif.getSession().subscribe((result3: any) => {
								if (result3 && result3.status === 'ok') {
									this.sessionArray = result3.data;
									this.notif.getSchool().subscribe((result2: any) => {
										if (result2.status === 'ok') {
											this.schoolInfo = result2.data[0];
											if (this.currentDate.getMonth() + 1 >= Number(this.schoolInfo.session_start_month) &&
												Number(this.schoolInfo.session_end_month) <= this.currentDate.getMonth() + 1) {
												const currentSession =
													(Number(this.currentDate.getFullYear()) + '-' + Number(this.currentDate.getFullYear() + 1)).toString();
												const findex = this.sessionArray.findIndex(f => f.ses_name === currentSession);
												if (findex !== -1) {
													const sessionParam: any = {};
													sessionParam.ses_id = this.sessionArray[findex].ses_id;
													localStorage.setItem('session', JSON.stringify(sessionParam));
												}
											} else {
												const currentSession =
													(Number(this.currentDate.getFullYear() - 1) + '-' + Number(this.currentDate.getFullYear())).toString();
												const findex = this.sessionArray.findIndex(f => f.ses_name === currentSession);
												if (findex !== -1) {
													const sessionParam: any = {};
													sessionParam.ses_id = this.sessionArray[findex].ses_id;
													localStorage.setItem('session', JSON.stringify(sessionParam));
												}
											}
											let returnUrl: any;
											if ((this.userSaveData && !this.userSaveData.pro_url) || !this.userSaveData) {
												localStorage.setItem('project', JSON.stringify({ pro_url: 'axiom' }));
												returnUrl = '/axiom';
											} else {
												returnUrl = this.userSaveData.pro_url;
												localStorage.setItem('project', JSON.stringify({ pro_url: this.userSaveData.pro_url }));
											}
											if (this.userSaveData && this.userSaveData.ses_id) {
												const sessionParam: any = {};
												sessionParam.ses_id = this.userSaveData.ses_id;
												localStorage.setItem('session', JSON.stringify(sessionParam));
											}
											if (JSON.parse(localStorage.getItem('currentUser')).role_id === '1') {
												this.returnUrl = '/admin';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '2') {
												this.returnUrl = returnUrl + '/school';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '3') {
												this.returnUrl = '/teacher';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '4') {
												this.returnUrl = '/student';
											} else if (JSON.parse(localStorage.getItem('currentUser')).role_id === '5') {
												this.returnUrl = returnUrl + '/parent';
											}
											this.router.navigate([this.returnUrl]);
										}
									});
								}
							});
						}
					} else {
						this.loaderService.stopLoading();
						if (result.status === 'error' && result.data === 'token not matched') {
							this.notif.showSuccessErrorMessage('Token Expired, Please enter a valid username and password', 'error');
						} else {
							this.notif.showSuccessErrorMessage('Please enter a valid username and password', 'error');
						}

						this.router.navigate(['/login']);
					}
				},
				error => {
					this.notif.showSuccessErrorMessage('Please enter a valid username and password', 'error');
				});
	}
	/* Calling HostListener to listen the keyboard event  */
	@HostListener('window:keyup', ['$event'])
	keyEvent(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			if (this.model.username && this.model.password) {
				this.login(event);
			} else {
				this.notif.showSuccessErrorMessage('Please enter a valid username and password', 'error');
			}
		}
	}

	getUserDetail(login_data) {
	}


	/* Forgot Password */

	active_resend_otp() {
		setTimeout(() => {
			this.resendOTPActive = true;
		}, 2000 * 60);
	}

	buildForm() {

		this.forgetPasswordForm = this.fbuild.group({
			username: ['', Validators.required],
			email: [''],
			mobile: ['']
		});
		this.validateOTPForm = this.fbuild.group({
			userotp: ''
		});
		this.validateNewPasswordForm = this.fbuild.group({
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
						if (result.status === 'ok') {
							if (result.data.url) {
								const xhr = new XMLHttpRequest();
								xhr.open('GET', result.data.url, true);
								xhr.send();
							}
							//   this.forgotdiv = false;
							//   this.resetdiv = true;
							this.forgotPassword = false;
							this.verifyOtp = true;
							this.notif.showSuccessErrorMessage(result.data, 'success');
						} else {
							this.notif.showSuccessErrorMessage(result.data, 'error');
						}
					}
				);
		} else if (!this.emailActive && this.forgetPasswordForm.valid) {
			this.fpasswordService.sendMail(this.forgetPasswordForm.value)
				.subscribe(
					(result: any) => {
						if (result.status === 'ok') {
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
				(result: any) => {
					if (result.status === 'ok') {
						const data = result.data;
						const expiredate = new Date(data.otp_expire_date);
						const nowdate = new Date();
						if ((expiredate.getTime() - nowdate.getTime()) / 1000 * 60 * 60 > 0) {
							this.otpdiv = true;
						} else {
							this.notif.showSuccessErrorMessage('OTP Expired', 'error');
						}
						this.loginCard = false;
						this.forgotPassword = false;
						this.forgotPasswordMobile = false;
						this.forgotPasswordEmail = false;
						this.verifyOtp = false;
						this.newPassword = true;
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
		if (this.validateNewPasswordForm.value.NewPassword === this.validateNewPasswordForm.value.ConfirmPassword) {
			const psdata = {};
			psdata['username'] = this.forgetPasswordForm.value.username;
			psdata['password'] = this.validateNewPasswordForm.value.NewPassword;
			this.fpasswordService.resetPassword(psdata).subscribe(
				(result: any) => {
					if (result.status === 'ok') {
						this.notif.showSuccessErrorMessage(result.data, 'success');
						this.loginCard = true;
						this.newPassword = false;
						this.verifyOtp = false;
						// this.router.navigate(['/login']);
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Password Mismatch', 'error');
		}
	}

	/*Forgot Password Ends*/
}
