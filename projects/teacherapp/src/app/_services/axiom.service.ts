import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
import { LoaderService } from './loader.service';
@Injectable()
export class AxiomService {

	constructor(private http: HttpClient, private service: LoaderService) { }

	// fetch subtopic , updated with global config
	/* getSubtopicByTopic(topic_id) {
		this.service.startLoading();
		return this.http.get(environment.apiAxiomUrl + `/setupdetail/getSubtopicByTopic/${topic_id}`);
	} */

	// fetch topic , updated with global config
	/* getTopicByClassSubject(class_id, subject_id) {
		const param: any = {};
		if (class_id) {
			param.class_id = class_id;
		}
		if (subject_id) {
			param.sub_id = subject_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/setupdetail/getTopicByBoardClassSubject', param);
	} */
	/* // updated with new api in common
	getSubjectsByClass(value) {
		const param: any = {};
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/setupdetail/getSubjectsByClass', param);
	} */
	getAllTeacher(value) {
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
		if (value.sub_id) {
			param.au_sub_id = value.sub_id;
		}
		if (value.status) {
			param.au_status = value.status;
		}
		if (value.role_id) {
			param.au_role_id = value.role_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/getAllTeacher', param);
	}
	/* // updated with global config
	getSubject() {
		this.service.startLoading();
		return this.http.get(environment.apiAxiomUrl + '/setup/subject/1');

	} */
}
