import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Subject } from 'rxjs';
import { TreeviewItem } from 'ngx-treeview';
import { NotificationsService } from 'angular2-notifications';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';

@Injectable()
export class CommonAPIService {
	menus: any[] = [];
	homeUrl: string;
	userData: any;
	reserv_id: any;
	constructor(private http: HttpClient, private _cookieService: CookieService,
		private _notificationService: NotificationsService) {
		this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
			(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
	}
	UserAccessMenu: any[] = [];
	question_type: any[] = [];
	question_subtype: any[] = [];
	showLoading = new Subject();
	studentData = new Subject();
	reRenderForm = new Subject();
	renderTab = new Subject();
	messageSub = new Subject();
	unsubscribePayAPI = new Subject();
	branchSwitchSubject = new Subject();
	userPrefix: any = '';
	familyData: any;
	familyNumber: any;
	selectedChildData: any;
	counterTimer: any = 0;
	notif: any = 0;
	searchDashboardData: any;
	sessionSub = new Subject();
	htmlToText(html: any) {
		const tmp = document.createElement('DIV'); // TODO: Check if this the way to go with Angular
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}
	startSessionTime() {
		this.sessionSub.next(true);
	}
	stopSessionTime() {
		this.sessionSub.next(false);
	}

	startLoading() {
		this.showLoading.next(true);
	}

	stopLoading() {
		this.showLoading.next(false);
	}
	getUserAccessMenu(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		if (value.pro_id) {
			param.pro_id = value.pro_id;
		}
		return this.http.post('/users/getUserAccessMenu', param);
	}
	setUserAccessMenu(value) {
		this.UserAccessMenu = [];
		if (this.menus.length === 0) {
			this.UserAccessMenu = value;
		} else {
			this.UserAccessMenu = this.menus;
		}
	}
	returnUserAccessMenu() {
		return of(this.UserAccessMenu);

	}
	isExistUserAccessMenu(mod_id) {
		if (this.menus.length === 0) {
			for (const mitem of this.UserAccessMenu) {
				if (Number(mitem.menu_mod_id) === Number(mod_id)) {
					return true;
				}
			}
			return false;
		} else {
			for (const mitem of this.menus) {
				if (Number(mitem.menu_mod_id) === Number(mod_id)) {
					return true;
				}
			}
			return false;
		}
	}
	isExist(arrayhas, field, id) {
		if (arrayhas.length > 0) {
			if (arrayhas.find(item => item[field] === id)) {
				return true;
			}
		}
		return false;
	}

	getItemData(type, arrayhas, data) {
		const treeItems: any[] = [];
		switch (type) {
			case 'menu':
				for (const moditem of data) {
					const mitem: any = {};
					mitem.text = moditem.mod_name;
					mitem.value = moditem.mod_id;
					mitem.checked = this.isExist(arrayhas, 'menu_mod_id', moditem.mod_id);
					mitem.children = [];
					for (const submenu1 of moditem.submenu_level_1) {
						const submenu1item: any = {};
						submenu1item.text = submenu1.mod_name;
						submenu1item.value = moditem.mod_id + '-' + submenu1.mod_id;
						submenu1item.checked = this.isExist(arrayhas, 'menu_mod_id', submenu1.mod_id);
						submenu1item.children = [];
						for (const submenu2 of submenu1.submenu_level_2) {
							const submenu2item: any = {};
							submenu2item.text = submenu2.mod_name;
							submenu2item.value = moditem.mod_id + '-' + submenu1.mod_id + '-' + submenu2.mod_id;
							submenu2item.checked = this.isExist(arrayhas, 'menu_mod_id', submenu2.mod_id);
							submenu1item.children.push(submenu2item);
						}
						mitem.children.push(submenu1item);
					}
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'class':
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.class_name;
					mitem.value = element.class_id;
					mitem.checked = this.isExist(arrayhas, 'class_id', element.class_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'subject':
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.sub_name;
					mitem.value = element.sub_id;
					mitem.checked = this.isExist(arrayhas, 'uc_sub_id', element.sub_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
			case 'topic':
				for (const element of data) {
					const mitem: any = {};
					mitem.text = element.topic_name;
					mitem.value = element.topic_id;
					mitem.checked = this.isExist(arrayhas, 'topic_id', element.topic_id);
					treeItems.push(new TreeviewItem(mitem));
				}
				break;
		}
		return treeItems;

	}
	showSuccessErrorMessage(message, type) {
		if (type === 'success' || type === 'ok') {
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
	getSchoolDetails() {
		return this.http.get('/dashboard/getSchool');
	}
	getProjectList(value) {
		const param: any = {};
		return this.http.post('/dashboard/getProjectList', param);
	}

	dateConvertion(value, format = 'yyyy-MM-dd') {
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(value, format);
	}
	getUrl() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const role_id = currentUser.role_id;
		if (role_id === 2) {
			this.homeUrl = '/school';
		} else if (role_id === 3) {
			this.homeUrl = '/teacher';
		} else if (role_id === 4) {
			this.homeUrl = '/student';
		}
		//
		return this.homeUrl;
	}
	getCokkieData() {
		if (this._cookieService && this._cookieService.get('userData')) {
			return this.userData = JSON.parse(this._cookieService.get('userData'));
		}
	}
	getSession() {
		return this.http.get(environment.apiSisUrl + '/siSetup/session/1');
	}
	getSchool() {
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getSchool2() {
		this.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getQTypeFromApi() {
		return this.http.get(environment.apiAxiomUrl + '/setup/question_type/1');
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
	setUserPrefix(prefix) {
		this.userPrefix = prefix;
	}
	getUserPrefix() {
		return this.userPrefix;
	}

	setFamilyData(value) {
		this.familyData = value;
	}

	getFamilyData() {
		return this.familyData;
	}


	setFamilyInformation(value) {
		this.familyNumber = value;
	}
	logout(value: any) {
		// this.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/logout', value);
	}
	getFamilyInformation() {
		return this.familyNumber;
	}

	setSelectedChildData(value) {
		this.selectedChildData = value;
	}

	getSelectedChildData() {
		return this.selectedChildData;
	}

	setReservoirId(reserv_id) {
		this.reserv_id = reserv_id;
	}

	getReservoirId() {
		return this.reserv_id;
	}

	setDashboardSearchData(searchDashboardData) {
		this.searchDashboardData = searchDashboardData;
	}

	getDashboardSearchData() {
		return this.searchDashboardData;
	}

	getPushNotification(value) {
		return this.http.post(environment.apiHRUrl + '/communication/getPushNotification', value);
	}
	getWebPushNotification(value) {
		return this.http.post(environment.apiHRUrl + '/communication/getWebPushNotification', value);
	}
	updateMessage(value) {
		return this.http.post(environment.apiHRUrl + '/communication/update', value);
	}
	setCounter(count) {
		this.counterTimer = count;
	}
	getCounter() {
		return this.counterTimer;
	}
	setNotif(count) {
		this.notif = count;
	}
	getNotif() {
		return this.notif;
	}
	resetNotif() {
		this.notif = 0;
	}
	getAllSchoolGroups(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getAllSchoolGroups',value);
	}

	getMappedSchoolWithUser(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getMappedSchoolWithUser',value);
	}
	getShiftAttendance(value) {
		return this.http.post(environment.apiHRUrl + '/shiftattendance/getall',value);
	}
	getShiftSeasonAttendance(value) {
		return this.http.post(environment.apiHRUrl + '/common/getSessionStaffAttendance',value);
	}
	getAllEmployeeLeaveData(value) {
		return this.http.post(environment.apiHRUrl + '/attendance/getSessionAttendance', value);
	}
	GetHolidayDays(value) {
		return this.http.post(environment.apiSmartUrl + '/common/GetHolidayDays', value);
	}
	getGlobalSetting(value) {
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}
	getHolidayOnly(value) {
		return this.http.post(environment.apiSmartUrl + '/common/getHolidayOnly', value);
	}
	checkAllowed(value) {
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getallowclass', value);
	}
}
