import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SisService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getEnrollmentStatus() {
		return of({
			status: 'ok', data: [
				{ enrol_id: 'active', enrol_name: 'Active' },
				{ enrol_id: 'left', enrol_name: 'Left' }
			]
		});
	}
	/* updated in smart with getClassData
	getClass(value) {
		const param: any = {};
		if (value.role_id === '3' || value.role_id === '1') {
			param.login_id = value.login_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getClassData', param);
	} */
	getSectionsByClass(value) {
		const param: any = {};
		param.class_id = value.class_id;
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getSectionsByClass', param);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getReason(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getReason', value);
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

	getStudentDataPerName(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentDataPerName', value);
	}

	getStudentInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentInformation', value);
	}
}
