import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { LoaderService } from './loader.service';
import { CookieService } from 'ngx-cookie';
import { Subject, of } from 'rxjs';
import { appConfig } from '../app.config';

@Injectable()
export class CommonAPIService {
		question_type: any[] = [];
		question_subtype: any[] = [];
		userData: any = {};
		viewProfile = new Subject();
		constructor(private http: HttpClient, private loaderService: LoaderService, private _cookieService: CookieService) { }

		getQTypeFromApi() {
				return this.http.get('/setup/question_type/1');
		}
		setQType(value) {
				this.question_type = [];
				this.question_type = value;
		}
		getQtype() {
				if (this.question_type.length > 0) {
						return of(this.question_type);
				}
				return of(this.question_type);
		}
		getQsubtype(qt_id) {
				let tempdata: any = null;
				if (this.question_type.length > 0) {
						this.question_type.forEach(element => {
								if (Number(element.qt_id) === Number(qt_id)) {
										tempdata = element.qst_id;
								}
						});
				}
				return of(tempdata);
		}
		getSession() {
				this.loaderService.startLoading();
				return this.http.get(appConfig.apiSisUrl + '/siSetup/session');
		}
		getSchool() {
				this.loaderService.startLoading();
				return this.http.get(appConfig.apiSisUrl + '/dashboard/getSchool');
		}
		logout(value: any) {
				this.loaderService.startLoading();
				return this.http.post(appConfig.apiSisUrl + '/users/logout', value);
		}
		getCokkieData() {
				if (this._cookieService && this._cookieService.get('userData')) {
					return this.userData = JSON.parse(this._cookieService.get('userData'));
				}
		}
}
