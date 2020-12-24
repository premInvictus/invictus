import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from './loader.service';
import { CookieService } from 'ngx-cookie';
import { Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class CommonAPIService {
	question_type: any[] = [];
	question_subtype: any[] = [];
	userData: any = {};
	viewProfile = new Subject();
	menus: any[] = [];
	constructor(private http: HttpClient, private loaderService: LoaderService, private _cookieService: CookieService,
		private _notificationService: NotificationsService) { }

	getQTypeFromApi() {
		return this.http.get(environment.apiAxiomUrl + '/setup/question_type/1');
	}
	setQType(value) {
		this.question_type = [];
		this.question_type = value;
	}
	generatePaySlip(value) {
		return this.http.post(environment.apiHRUrl + '/employee/generatePaySlip', value);
	}
	getQtype() {
		if (JSON.parse(localStorage.getItem('qSubType'))) {
			this.question_type = JSON.parse(localStorage.getItem('qSubType'));
			return of(this.question_type);
		}
		return of(this.question_type);
	}
	getEmployeeSalaryDetail(value){
		return this.http.post(environment.apiHRUrl + '/salary-compute/getAll', value);
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
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}
	getSchool() {
		this.loaderService.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	logout(value: any) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/logout', value);
	}
	getCokkieData() {
		if (this._cookieService && this._cookieService.get('userData')) {
			return this.userData = JSON.parse(this._cookieService.get('userData'));
		}
	}
	dateConvertion(value, format = 'yyyy-MM-dd') {
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(value, format);
	}
	showSuccessErrorMessage(message, type) {
		if (type === 'success') {
			this._notificationService.success('Success', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		} else if (type === 'error') {
			this._notificationService.error('Error', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		} else if (type === 'info') {
			this._notificationService.info('Info', message, {
				timeout: 2000,
				showProgressBar: true,
				pauseOnHover: true
			});
		}
	}
	htmlToText(html: any) {
		const tmp = document.createElement('DIV'); // TODO: Check if this the way to go with Angular
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

	insertMessage(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/insert', value);
	}

	updateMessage(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/update', value);
	}

	getMessage(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/getAll', value);
	}
	getEmployeeDetail(value) {
		return this.http.post(environment.apiHRUrl + '/employee/get', value);
	}
	getLeaveManagement() {
		return this.http.get(environment.apiHRUrl + '/leave-management/getLeaveManagement');
	}
	getAllEmployee(value) {
		return this.http.post(environment.apiHRUrl + '/employee/getAllEmployee', value);
	}
	updateEmployee(value) {
		return this.http.post(environment.apiHRUrl + '/employee/update', value);
	}
	getFeeMonths(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeMonths');
	}
	getBanks(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getBanks');
	}
	getEmployeeLedger(value) {
		return this.http.post(environment.apiHRUrl + '/employee/getEmployeeLedger', value);
	}
	getEmployeeNavigationRecords(value) {
		return this.http.post(environment.apiHRUrl + '/employee/getNavigationId', value);
	}

	isExistUserAccessMenu(mod_id) {
		if (this.menus.length === 0) {
			this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
				(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
		} else {
			for (const mitem of this.menus) {
				if (Number(mitem.menu_mod_id) === Number(mod_id)) {
					return true;
				}
			}
			return false;
		}
	}
}
