import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SisService {
 
	constructor(private http: HttpClient, private service: CommonAPIService) { }
	
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
	getAllSchoolGroups(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getAllSchoolGroups',value);
	}

	getMappedSchoolWithUser(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getMappedSchoolWithUser',value);
	}
}
