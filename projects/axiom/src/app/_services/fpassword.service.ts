import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';

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
				return this.http.post(environment.apiAxiomUrl + '/users/authenticate', value, { headers: headers });
}

sendMail(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/forgot_password_email', value, { headers: headers });
}

validateOTP(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/validate_otp', value, { headers: headers });
}

resetPassword(value: any) {
				const userParam = value.username.split('-');
				const prefixOptions = {
								'Prefix': userParam[0]
				};
				const headers = new HttpHeaders(prefixOptions);
				return this.http.post(environment.apiAxiomUrl + '/users/change_password', value, { headers: headers });
}

}
