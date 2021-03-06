import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SisService {
 
	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getSectionsByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionsByClass', value);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getSubjectSubexamMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getSubjectSubexamMapping', value);
	}
	getExamDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamDetails', value);
	}
	getReason(value) {
		this.service.startLoading();
		
		return this.http.post(environment.apiSisUrl + '/setup/getReason', value);
	}
	getExamPerCumulativeExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamPerCumulativeExam', value);
	}
	getClassTerm(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/common/getClassTerm', value);
	}
	getPaymentGateways(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/getPaymentGateways', value);
	}
	uploadDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/uploadDocuments', value);
	}
	getSession() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}
	insertEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '3';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/insertEditRequest', value);
	}
	updateEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '3';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/updateEditRequest', value);
	}
	getEditRequest(value) {
		value.pro_id = '3';
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/getEditRequest', value);
	}
	getFormFields(value) {
		this.service.startLoading();
		value.ff_project_id = '3';
		return this.http.post(environment.apiSisUrl + '/configure/getFormFields', value);
	}
	getFormFieldsForFilter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/configure/getFormFieldsForFilter', value);
	}
	getStudentLastRecordPerProcessType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/studentDetails/getStudentLastRecordPerProcessType/fee');
	}
	getUser(value) {
		const param: any = {};
		if (value.full_name) {
			param.au_full_name = value.full_name;
		}
		if (value.login_id) {
			param.au_login_id = value.login_id;
		}
		if (value.class_id) {
			param.au_class_id = value.class_id;
		}
		if (value.sec_id) {
			param.au_sec_id = value.sec_id;
		}
		if (value.role_id) {
			param.au_role_id = value.role_id;
		}
		if (value.sub_id) {
			param.au_sub_id = value.sub_id;
		}
		if (value.status) {
			param.au_status = value.status;
		}
		if (value.au_admission_no) {
			param.au_admission_no = value.au_admission_no;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/getUser', param);
	}
	getStateCountryByCity(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getStateCountryByCity', value);
	}
	getState() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/getState/');
	}
	getQualifications() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/qualifications/getQualifications');
	}
	getDepartment(value) {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/department');
	}
	getGender() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/gender');
	}

	getTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/getNotificationTemplate', value);
	}

	saveTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/insertNotificationTemplate', value);
	}

	updateTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/updateNotificationTemplate', value);
	}
	getMasterStudentDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudents', value);
	}
	getClass(value) {
		const param: any = {};
		if (value.role_id === '3' || value.role_id === '1') {
			param.login_id = value.login_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getClassData', param);
	}
	insertEmailScheduler(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/insertEmailScheduler', value);
	}

	insertEmailData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/insertEmailData', value);
	}

	sendEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/sendEmail', value);
	}

	getNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/getNotificationEmail', value);
	}

	insertSMSScheduler(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/insertSMSScheduler', value);
	}

	insertSMSData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/insertSMSData', value);
	}

	sendSMS(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/sendSMS', value);
	}

	getNotificationSMS(value) {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/notificationSMS/getNotificationSMS', value);
	}

	deleteNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/deleteEmailScheduler', value);
	}
	deleteNotificationSMS(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/deleteSMSScheduler', value);
	}
	getAllStudentsByClassSection(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudentsByClassSection', value);
	}
	getGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}
	updateGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateGlobalSetting', value);
	}
	getAdmissionStudentDataPerName(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getAdmissionStudentDataPerName', value);
	}
	getGlobalSettingGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSettingGroup', value);
	}
	resetAdmitCode(value) {
		return this.http.post(environment.apiSisUrl + '/users/resetAdmitCode', value);
	}
	getMaster(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/common/findAll', value);
	}
	getAllDesignation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/designation/getAll', value);
	}

	getAllWing(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/wing/getAll', value);
	}
	getCategoryOne(value) {
		this.service.startLoading();
		return this.http.post(environment.apiHRUrl + '/category-one/getAll', value);
	}
}
