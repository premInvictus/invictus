import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LoaderService } from '../../../_services/index';

@Injectable()
export class AdminService {

	constructor(
		private http: HttpClient,
		private loaderService: LoaderService
	) { }

	getSchoolDetails() {
		return this.http.get('/dashboard/getSchool');
	}
	getProjectList(value) {
		const param: any = {};
		return this.http.post('/dashboard/getProjectList', param);
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
		this.loaderService.startLoading();
		return this.http.post('/users/addUserAccessClass', value);
	}
	addUserAccessSubject(value) {
		this.loaderService.startLoading();
		return this.http.post('/users/addUserAccessSubject', value);
	}
	addUserAccessTopic(value) {
		this.loaderService.startLoading();
		return this.http.post('/users/addUserAccessTopic', value);
	}
	getUserAccessClass(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this.http.post('/users/getUserAccessClass', param);
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
		return this.http.post('/users/getUserAccessSubject', param);
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
		return this.http.post('/users/getUserAccessTopic', param);
	}
	addUserAccessMenu(value) {
		return this.http.post('/users/addUserAccessMenu', value);
	}
	addSchool(value) {
		this.loaderService.startLoading();
		return this.http.post('/dashboard/addSchool', value);
	}
	importSampleDataForSchool(value) {
		this.loaderService.startLoading();
		return this.http.post('/dashboard/importSampleDataForSchool', value);
	}
	deleteSchool(value) {
		return this.http.delete(`/dashboard/activeInactiveSchool/${value.school_id}`);
	}
	editSchool(value) {
		return this.http.post('/dashboard/updateSchool', value);
	}
	getAllUsers() {
		return this.http.get('/dashboard/getAllUsers');
	}
	checkPrefix(value: any) {
		return this.http.post('/dashboard/checkPrefix', { school_prefix: value });
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
		return this.http.post('/dashboard/getDashboardReport', param);
	}
	getClassLeaderBoard() {
		return this.http.get('/dashboard/getClassLeaderBoard');
	}
	getStudentLeaderBoard() {
		return this.http.get('/dashboard/getStudentLeaderBoard');
	}
	getExamSetupPerClassPerMonth(value) {
		const param: any = {};
		if (value.year) {
			param.year = value.year;
		}
		if (value.si_prefix) {
			param.si_prefix = value.si_prefix;
		}
		return this.http.post('/dashboard/getExamSetupPerClassPerMonth', param);
	}
	reset_password(value) {
		return this.http.post('/users/reset_password', value);
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
		return this.http.post('/dashboard/getStudentReportPerSubjectMarks', param);
	}
	getHighestPercentageByStudentInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post('/dashboard/getHighestPercentageByStudentInAllExams', param);
	}
	getPercentageByStudentInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post('/dashboard/getPercentageByStudentInAllExams', param);
	}
	getStudentRankInAllExams(value) {
		const param: any = {};
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this.http.post('/dashboard/getStudentRankInAllExams', param);
	}
}
