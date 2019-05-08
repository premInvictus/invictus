import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { appConfig } from '../app.config';

@Injectable()
export class FpasswordService {

		constructor(
				private http: HttpClient
		) {}

		getOTP(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(appConfig.apiUrl + '/users/authenticate', value, { headers: headers });
}

sendMail(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(appConfig.apiUrl + '/users/forgot_password_email', value, { headers: headers });
}

validateOTP(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(appConfig.apiUrl + '/users/validate_otp', value, { headers: headers });
}

resetPassword(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(appConfig.apiUrl + '/users/change_password', value, { headers: headers });
}

}
