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
	getStudentInformation(value) {
		this.service.startLoading();
		value.fromFee = 'fee';
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentInformation', value);
	}
	getActivity() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/activity');
	}
	getActivityClub() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/activityClub');
	}
	getLevelOfInterest() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/levelOfInterest');
	}
	getEventLevel() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/eventLevel');
	}
	getAuthority() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/authority');
	}
	getSkillAwards(value) {
		return this.http.post(environment.apiSisUrl + '/skillsAwards/getSkillsAwards', value);
	}
	getGeneralRemarks(value) {
		return this.http.post(environment.apiSisUrl + '/remarks/getGeneralRemarks', value);
	}
}
