import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class AxiomService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }

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
	getUser(value) {
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/getUser', value);
	}
}
