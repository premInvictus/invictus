import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../../_services/index';
import { environment } from 'src/environments/environment';

@Injectable()
export class AdminService {

	constructor(
		private http: HttpClient,
		private loaderService: LoaderService
	) { }

	getSchoolDetails() {
		return this.http.get(environment.apiAxiomUrl + '/dashboard/getSchool');
	}
	getProjectList(value) {
		const param: any = {};
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getProjectList', param);
	}
	getModuleList(value) {
		const param: any = {};
		if (value.pro_id) {
			param.pro_id = value.pro_id;
		}
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		if (value.mor_type) {
			param.mor_type = value.mor_type;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getModuleList', param);
	}
	getUserAccessSchool(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessSchool', param);
	}
	getUserAccessProject(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.school_id) {
			param.si_id = value.school_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessProject', param);
	}
	addUserAccessControl(value) {
		return this.http.post(environment.apiAxiomUrl + '/users/addUserAccessControl', value);
	}
	addUserAccessClass(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/addUserAccessClass', value);
	}
	addUserAccessSubject(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/addUserAccessSubject', value);
	}
	addUserAccessTopic(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/addUserAccessTopic', value);
	}
	getUserAccessClass(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessClass', param);
	}
	getUserAccessSubject(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessSubject', param);
	}
	getUserAccessTopic(value) {
		this.loaderService.startLoading();
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
		return this.http.post(environment.apiAxiomUrl + '/users/getUserAccessTopic', param);
	}
	addUserAccessMenu(value) {
		return this.http.post(environment.apiAxiomUrl + '/users/addUserAccessMenu', value);
	}
	addSchool(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/dashboard/addSchool', value);
	}
	importSampleDataForSchool(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/dashboard/importSampleDataForSchool', value);
	}
	deleteSchool(value) {
		return this.http.delete(environment.apiAxiomUrl + `/dashboard/activeInactiveSchool/${value.school_id}`);
	}
	editSchool(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/updateSchool', value);
	}
	getAllUsers() {
		return this.http.get(environment.apiAxiomUrl + '/dashboard/getAllUsers');
	}
	checkPrefix(value: any) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/checkPrefix', { school_prefix: value });
	}
	getDashboardReport(value) {
		const param: any = {};
		if (value.qus_status) {
			param.qus_status = value.qus_status;
		}
		if (value.tp_status) {
			param.tp_status = value.tp_status;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		if (value.qp_status) {
			param.qp_status = value.qp_status;
		}
		if (value.login_id) {
			param.au_login_id = value.login_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getDashboardReport', param);
	}
	getClassLeaderBoard() {
		return this.http.get(environment.apiAxiomUrl + '/dashboard/getClassLeaderBoard');
	}
	getStudentLeaderBoard() {
		return this.http.get(environment.apiAxiomUrl + '/dashboard/getStudentLeaderBoard');
	}
	getExamSetupPerClassPerMonth(value) {
		const param: any = {};
		if (value.year) {
			param.year = value.year;
		}
		if (value.si_prefix) {
			param.si_prefix = value.si_prefix;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getExamSetupPerClassPerMonth', param);
	}
	reset_password(value) {
		return this.http.post(environment.apiAxiomUrl + '/users/reset_password', value);
	}

	getStudentReportPerSubjectMarks(value) {

		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.section_id) {
			param.section_id = value.section_id;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getStudentReportPerSubjectMarks', param);
	}
	getHighestPercentageByStudentInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getHighestPercentageByStudentInAllExams', param);
	}
	getPercentageByStudentInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getPercentageByStudentInAllExams', param);
	}
	getStudentRankInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getStudentRankInAllExams', param);
	}
	updateUserProject(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/updateUserProject', value);
	}
	getUserProject(value) {
		this.loaderService.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/users/getUserProject', value);
	}
}
