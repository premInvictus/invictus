import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../../_services/index';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthenticationService {
	constructor(private http: HttpClient, private loaderService: CommonAPIService) { }

	login(username: string, password: any, device_id: any, type: any, loginSource:any) {
		this.loaderService.startLoading();
		let prefixOptions;
		if (username.match(/-/g)) {
			const userParam = username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}



		const headers = new HttpHeaders(prefixOptions);
		console.log('loginSource--', loginSource,prefixOptions );
		if (loginSource=='support') {
			let hOptions = {
				'Prefix': username.split('-')[0],
				'LoginSource' : 'support'
			};
			let pheaders = new HttpHeaders(hOptions);
			return this.http.post(environment.apiSisUrl + '/users/supportAuthenticate', { username: username, password: password, device_id: device_id, type: type }, { headers: pheaders });
		} else if (loginSource=='branch-change') {
			let hOptions = {
				'Prefix': username.split('-')[0],
				'LoginSource' : 'branch-change'
			};
			console.log('hOptions--', hOptions)
			let pheaders = new HttpHeaders(hOptions);
			return this.http.post(environment.apiSisUrl + '/users/authenticate', { username: username, password: password, device_id: device_id, type: type }, { headers: pheaders });
		} else {
			// tslint:disable-next-line:max-line-length
			console.log('this.loaderService.getUserPrefix()',this.loaderService.getUserPrefix());
			if (this.loaderService.getUserPrefix()) {
				return this.http.post(environment.apiSisUrl + '/users/authenticate', { username: username, password: password, device_id: device_id, type: type });
			} else {
				return this.http.post(environment.apiSisUrl + '/users/authenticate', { username: username, password: password, device_id: device_id, type: type }, { headers: headers });
			}
		}
		
	}

	logout() {

		localStorage.removeItem('currentUser');
	}
	getOTP(value: any) {
		let prefixOptions;
		if (value.username.match(/-/g)) {
			const userParam = value.username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}
		const headers = new HttpHeaders(prefixOptions);
		// return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
		if (this.loaderService.getUserPrefix()) {
			return this.http.post(environment.apiAxiomUrl + '/users/forgot_password_mobile', value);
		} else {
			return this.http.post(environment.apiAxiomUrl + '/users/forgot_password_mobile', value, { headers: headers });
		}
	}
	sendMail(value: any) {
		let prefixOptions;
		if (value.username.match(/-/g)) {
			const userParam = value.username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}
		const headers = new HttpHeaders(prefixOptions);
		if (this.loaderService.getUserPrefix()) {
			return this.http.post(environment.apiAxiomUrl + '/users/forgot_password_email', value);
		} else {
			return this.http.post(environment.apiAxiomUrl + '/users/forgot_password_email', value, { headers: headers });
		}
	}
	validateOTP(value: any) {
		let prefixOptions;
		if (value.username.match(/-/g)) {
			const userParam = value.username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}
		const headers = new HttpHeaders(prefixOptions);
		if (this.loaderService.getUserPrefix()) {
			return this.http.post(environment.apiAxiomUrl + '/users/validate_otp', value);
		} else {
			return this.http.post(environment.apiAxiomUrl + '/users/validate_otp', value, { headers: headers });
		}
	}
	resetPassword(value: any) {
		let prefixOptions;
		if (value.username.match(/-/g)) {
			const userParam = value.username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}
		const headers = new HttpHeaders(prefixOptions);
		if (this.loaderService.getUserPrefix()) {
			return this.http.post(environment.apiAxiomUrl + '/users/change_password', value);
		} else {
			return this.http.post(environment.apiAxiomUrl + '/users/change_password', value, { headers: headers });
		}
	}

	getUserProjectDetail(value: any) {
		this.loaderService.startLoading();
		let prefixOptions;
		if (value.username.match(/-/g)) {
			const userParam = value.username.split('-');
			prefixOptions = {
				'Prefix': userParam[0]
			};
		}
		const headers = new HttpHeaders(prefixOptions);
		const inputJson = { login_id: value.login_id };
		return this.http.post(environment.apiSisUrl + '/users/getUserProject', inputJson, { headers: headers });
	}


}
