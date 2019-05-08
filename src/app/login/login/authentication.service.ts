import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../../_services/index';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthenticationService {
		constructor(private http: HttpClient, private loaderService: CommonAPIService) { }

		login(username: string, password: any) {
				this.loaderService.startLoading();
				const userParam = username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);

				// tslint:disable-next-line:max-line-length
				return this.http.post(environment.apiSisUrl + '/users/authenticate', { username: username, password: password }, { headers: headers });
		}

		logout() {

				localStorage.removeItem('currentUser');
		}
		getOTP(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
		}
		sendMail(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
		}
		validateOTP(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
		}
		resetPassword(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
		}

		getUserProjectDetail(value: any) {
				this.loaderService.startLoading();
				const userParam = value.username.split('-');
				const prefixOptions = {
						'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				const inputJson = { login_id: value.login_id };
				return this.http.post(environment.apiSisUrl + '/users/getUserProject', inputJson, { headers: headers });
		}


}
