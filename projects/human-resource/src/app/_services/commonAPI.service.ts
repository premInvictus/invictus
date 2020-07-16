import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TreeviewItem } from 'ngx-treeview';
import { NotificationsService } from 'angular2-notifications';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
@Injectable()
export class CommonAPIService {

	homeUrl: string;
	userData: any;
	menus: any[] = [];
	constructor(private http: HttpClient,
		private _notificationService: NotificationsService,
		private _cookieService: CookieService,
		private loader: LoaderService) {
	}
	UserAccessMenu: any[] = [];
	showLoading = new Subject();
	employeeData = new Subject();
	reRenderForm = new Subject();
	renderTab = new Subject();
	tabChange = new Subject();
	htmlToText(html: any) {
		const tmp = document.createElement('DIV'); // TODO: Check if this the way to go with Angular
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}
	getBloodGroup() {
		return this.http.get(environment.apiSisUrl + '/bloodGroup/getBloodGroup');
	}
	getIdCardPrintSettings(value) {
		return this.http.post(environment.apiSisUrl + '/configure/getPrintSetting', value);
	}
	addIdCardPrintSettings(value) {
		return this.http.post(environment.apiSisUrl + '/configure/printSetting', value);
	}
	startLoading() {
		this.loader.startLoading();
	}

	stopLoading() {
		this.loader.stopLoading();
	}

	getCokkieData() {
		if (this._cookieService && this._cookieService.get('userData')) {
			return this.userData = JSON.parse(this._cookieService.get('userData'));
		}
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
		return this.http.post(environment.apiSisUrl + '/users/getUserAccessMenu', param);
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
	getSchoolDetails() {
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getProjectList(value) {
		const param: any = {};
		return this.http.post(environment.apiSisUrl + '/dashboard/getProjectList', param);
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

	isExistUserAccessMenuByLabel(parent_id, mod_name) {
		if (this.menus.length === 0) {
			this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
				(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
		} else {
			for (const mitem of this.menus) {
				if (mitem.mod_parent_id === parent_id && (mitem.mod_name.toLowerCase() === mod_name.toLowerCase())) {
					return true;
				}
			}
			return false;
		}
	}
	getClassTerm(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiExamUrl + '/common/getClassTerm', value);
	}
	insertEmployeeDetails(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/insert', value);
	}

	getAllEmployee(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/getAllEmployee', value);
	}
	checkEmpCodeNo(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/checkEmpCodeNo', value);
	}

	getEmployeeDetail(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/get', value);
	}

	updateEmployee(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/update', value);
	}

	updateEnquiry(value) {
		
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/update-career-enquiry', value);
	}
	deleteEnquiry(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/update-career-enquiry', value);
	}
	updateEmployeeDatainBulk(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/updateEmployeeDatainBulk', value);
	}
	generatePaySlip(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/generatePaySlip', value);
	}
	getEmployeeLedger(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/getEmployeeLedger', value);
	}

	deleteEmployee(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/update', value);
	}

	getEmployeeNavigationRecords(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/getNavigationId', value);
	}


	getAllDesignation(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/designation/getAll', value);
	}

	getAllWing(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/wing/getAll', value);
	}
	getCategoryOne(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/category-one/getAll', value);
	}
	getCategoryTwo(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/category-two/getAll', value);
	}
	getCategoryThree(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/category-three/getAll', value);
	}
	getSalaryStructure(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-structure/getAll', value);
	}
	getFilterData(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/getFilterData', value);
	}
	getSalaryHeads(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-component/getAll', value);
	}
	insertSalaryCompute(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-compute/insert', value);
	}
	updateInBulk(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-compute/updateInBulk', value);
	}
	insertInBulk(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-compute/insertInBulk', value);
	}

	updateSalaryCompute(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-compute/update', value);
	}

	getSalaryCompute(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-compute/getAll', value);
	}
	insertMaster(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/common/insert', value);
	}
	getMaster(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/common/findAll', value);
	}
	updateMaster(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/common/update', value);
	}
	insertSalaryComponent(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-component/insert', value);
	}
	getSalaryComponent() {
		return this.http.get(environment.apiHRUrl + '/salary-component/getSalaryComponent');
	}
	updateSalaryComponent(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-component/update', value);
	}
	insertSalaryStructure(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-structure/insert', value);
	}
	insertAttendance(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/attendance/insertAttendance', value);
	}
	updateAttendance(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/attendance/updateAttendance', value);
	}
	checkAttendance(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/attendance/checkAttendance', value);
	}
	getSalaryStr() {
		return this.http.get(environment.apiHRUrl + '/salary-structure/getSalaryStructure');
	}
	updateSalaryStructure(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/salary-structure/update', value);
	}
	getBanks(value) {
		return this.http.get(environment.apiFeeUrl + '/feeSetup/getBanks');
	}
	getAdminReturn(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/admin-return/getAdminReturn', value);
	}
	updateAdminReturn(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/admin-return/updateAdminReturn', value);
	}
	insertAdminReturn(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/admin-return/insertAdminReturn', value);
	}
	insertLeaveManagement(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/leave-management/insertLeaveManagement', value);
	}
	updateLeaveManagement(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/leave-management/updateLeaveManagement', value);
	}
	getLeaveManagement() {
		return this.http.get(environment.apiHRUrl + '/leave-management/getLeaveManagement');
	}
	insertDepartmentLeave(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/department-leave/insertDepartmentLeave', value);
	}
	updateDepartmentLeave(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/department-leave/updateDepartmentLeave', value);
	}
	getDepartmentLeave() {
		return this.http.get(environment.apiHRUrl + '/department-leave/getDepartmentLeave');
	}
	getCommunication() {
		return this.http.get(environment.apiHRUrl + '/communication/getCommunication');
	}

	getEmployeeLeaveData(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee-leave-management/get', value);
	}

	insertEmployeeLeaveData(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee-leave-management/insert', value);
	}

	updateEmployeeLeaveData(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee-leave-management/update', value);
	}

	deleteEmployeeLeaveData(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee-leave-management/delete', value);
	}
	getAllEmployeeLeaveData() {
		return this.http.get(environment.apiHRUrl + '/employee-leave-management/getAllEmployeeLeaveData');
	}

	downloadEmployeeExcel(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/bulkUpdate/downloadEmployeeExcel', value);
	}

	uploadEmployeeExcel(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/bulkUpdate/uploadEmployeeExcel', value);
	}

	insertMessage(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/insert', value);
	}

	updateMessage(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/update', value);
	}

	getMessage(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/getAll', value);
	}

	getLastMessageRecord(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/lastMessageId', value);
	}
	getCareerEnq(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/get-career-enquiry', value);
	}
	insertCareerEnq(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/insert-career-enquiry', value);
	}
	updateCareerEnq(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/update-career-enquiry', value);
	}
	getEnquiryNavigationRecords(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/get-career-navigation-id', value);
	}
	getAllCareerEnq(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/career-enquiry/get-all-career-enquiry', value);
	}
	checkDepartmentEntry(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/department-leave/checkDepartmentEntry', value);
	}
	getVoucherTypeMaxId(value) {
		return this.http.post(environment.apiFaUrl + '/voucher-entry/getMaxVoucherTypeId', value);
	}

	getAllSubjects(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/common/findAll', value);
	}

}
