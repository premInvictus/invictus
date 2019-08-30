import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LoaderService } from './loader.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class AuthenticationService {
		constructor(private http: HttpClient, private loaderService: LoaderService) { }

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
}
