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
	getClass(value) {
		const param: any = {};
		if (value.role_id === '3' || value.role_id === '1') {
			param.login_id = value.login_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getClassData', param);
	}
	getSectionsByClass(value) {
		const param: any = {};
		param.class_id = value.class_id;
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getSectionsByClass', param);
	}
	getSectionAll() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/section');
	}
	getQualifications() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/qualifications/getQualifications');
	}
	getHouses() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/houses/getHouses');
	}

	getOccupationType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/occupationType/getOccupationType');
	}

	getStudentInformation(value) {
		this.service.startLoading();
		value.fromFee = 'fee';
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentInformation', value);
	}

	getReligionDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/religionDetails/getReligionDetails', value);
	}
	getMotherTongue(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/motherTongue/getMotherTongue', value);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getGender() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/gender');
	}
	getCategory() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/category');
	}
	getReason(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getReason', value);
	}
	getBloodGroup() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/bloodGroup/getBloodGroup');
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
	getTabBifurcation() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/configure/getTabBifurcation');
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
	logout(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/logout', value);
	}
	saveUserLastState(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/saveUserLastState', value);
	}
}
