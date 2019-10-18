import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonAPIService } from '../_services/index';
import { environment } from '../../../../../src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class HrusertypeService {

	constructor(
		private http: HttpClient,
		private commonAPIService: CommonAPIService
	) { }
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
		this.commonAPIService.startLoading();
		return this.http.post('/users/getAllTeacher', param);
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
		this.commonAPIService.startLoading();
		return this.http.post('/users/getUser', param);
	}
	addUser(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/users/addUser', value);
	}
	updateUser(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/users/updateUser', value);
	}
	deleteUser(value) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/users/deleteUser/${value.au_login_id}`);
	}
	getProjectList(value) {
		const param: any = {};
		return this.http.post(environment.apiSisUrl + '/dashboard/getProjectList', param);
	}
	getModuleList(value) {
		const param: any = {};
		if (value.pro_id) {
			param.pro_id = value.pro_id;
		}
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		return this.http.post('/dashboard/getModuleList', param);
	}
	getUserAccessSchool(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this.http.post('/users/getUserAccessSchool', param);
	}
	getUserAccessProject(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.school_id) {
			param.si_id = value.school_id;
		}
		return this.http.post('/users/getUserAccessProject', param);
	}
	addUserAccessControl(value) {
		return this.http.post('/users/addUserAccessControl', value);
	}
	addUserAccessClass(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/users/addUserAccessClass', value);
	}
	addUserAccessSubject(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/users/addUserAccessSubject', value);
	}
	addUserAccessTopic(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/users/addUserAccessTopic', value);
	}
	getUserAccessClass(value) {
		this.commonAPIService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this.http.post('/users/getUserAccessClass', param);
	}
	getUserAccessSubject(value) {
		this.commonAPIService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		return this.http.post('/users/getUserAccessSubject', param);
	}
	getUserAccessTopic(value) {
		this.commonAPIService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.sub_id) {
			param.sub_id = value.sub_id;
		}
		return this.http.post('/users/getUserAccessTopic', param);
	}
	addUserAccessMenu(value) {
		return this.http.post('/users/addUserAccessMenu', value);
	}
	reset_password(value) {
		return this.http.post('/users/reset_password', value);
	}
}
