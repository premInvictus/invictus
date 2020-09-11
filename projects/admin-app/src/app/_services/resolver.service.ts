import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpEvent, HttpInterceptor,
	HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';
import { SisService, CommonAPIService, ProcesstypeFeeService } from '../_services/index';
@Injectable()
export class ResolverService {
	userData = [];
	returnUrl: string;
	currentDate = new Date();
	sessionArray: any[] = [];
	currentSessionId: any;
	schoolInfo: any = {};
	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
		private routes: ActivatedRoute, private _cookieService: CookieService, private sisService: SisService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		this.route.queryParams.subscribe(params => {
			if (params && params.validate_token) {
				const validate_token = params.validate_token;
				const req = new XMLHttpRequest();
				req.overrideMimeType('application/json');
				req.open('GET', environment.apiSisUrl + '/users/authentication?validate_token=' + validate_token, true);
				req.onload = () => {
					const jsonResponse = JSON.parse(req.responseText);
					// do something with jsonResponse
					const user = jsonResponse.data;
					const tempJson = {
						CID: user.clientKey,
						SID: user.secretKey,
						AN: user.token,
						UR: user.role_id,
						LN: user.login_id,
						PF: user.Prefix
					};
					if (user) {
						localStorage.setItem('currentUser', JSON.stringify(
							{ 'role_id': tempJson['UR'], 'login_id': tempJson['LN'], 'Prefix': tempJson['PF'] }
						));
						this._cookieService.put('userData', JSON.stringify(tempJson));
						if (this._cookieService.get('userData')) {
							this.sisService.getSession().subscribe((result3: any) => {
								if (result3.status === 'ok') {
									this.sessionArray = result3.data;
									this.sisService.getSchool().subscribe((result2: any) => {
										if (result2.status === 'ok') {
											this.schoolInfo = result2.data[0];
											if (this.currentDate.getMonth() + 1 >= Number(this.schoolInfo.session_start_month) &&
											Number(this.schoolInfo.session_end_month) <= this.currentDate.getMonth() + 1 ){
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
											this.userData = JSON.parse(this._cookieService.get('userData'));
											if (this.userData['UR'] === '1') {
												this.returnUrl = '/admin';
											} else if (this.userData['UR'] === '2') {
												this.returnUrl = '/school';
											} else if (this.userData['UR'] === '3') {
												this.returnUrl = '/teacher';
											} else if (this.userData['UR'] === '4') {
												this.returnUrl = '/student';
											} else if (this.userData['UR'] === '5') {
												this.returnUrl = '/parent';
											}
											this.router.navigate([this.returnUrl], { queryParams: {}, relativeTo: this.route });
										}
									});
								}
							});
						}


					}
				};
				req.send();
			}

		});


	}
}
