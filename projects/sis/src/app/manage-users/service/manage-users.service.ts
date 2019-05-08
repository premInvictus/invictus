import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonAPIService } from '../../_services/index';
@Injectable()

export class ManageUsersService {
	currentUser: any = {};
	constructor(
		private http: HttpClient,
		private commonAPIService: CommonAPIService
	) { }
	uploadDocuments(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/documents/uploadDocuments', value);
	}
	exportClass(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/exportClass', value);
	}
	exportSubject(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/exportSubject', value);
	}
	exportTopic(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/exportTopic', value);
	}
	exportSubTopic(value) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/exportSubTopic', value);
	}

	addBoard(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/board', value);
	}
	addSection(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/section', value);
	}
	addSubject(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/subject', value);
	}

	addClass(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/classes', value);
	}
	addTopic(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/topic', value);
	}
	addSubtopic(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/subtopic', value);
	}
	addQsubtype(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/question_subtype', value);
	}
	addQtype(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/question_type', value);
	}
	addSkill(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/skilltype', value);
	}
	addLod(value: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setup/difficulties_level', value);
	}
	getBoard() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/board');
	}
	getBoardALL() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/board');
	}
	getSection() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/section/1');
	}
	getSectionAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/section');
	}
	getSubject() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/subject/1');
	}
	getSubjectAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/subject');
	}
	/* getClass() {
      this.commonAPIService.startLoading();
      return this.http.get('/setup/classes/1');
  } */
	getClass() {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		if (this.currentUser.role_id === '3' || this.currentUser.role_id === '1') {
			param.login_id = this.currentUser.login_id;
		}
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getClassData', param);
	}
	getClassAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/classes');
	}
	getTopic() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/topic/1');
	}
	getTopicAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/topic');
	}
	getSubtopic() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/subtopic/1');
	}
	getSubtopicAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/subtopic');
	}
	getQsubtype() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/question_subtype/1');
	}
	getQsubtypeAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/question_subtype');
	}
	getSkill() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/skilltype/1');
	}
	getSkillAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/skilltype');
	}
	getLod() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/difficulties_level/1');
	}
	getLodAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/difficulties_level');
	}
	getCountry() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getCountry/1');
	}
	getCountryAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getCountry');
	}
	getState() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getState/1');
	}
	getStateAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getState');
	}
	getCity() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getCity/1');
	}
	getCityAll() {
		this.commonAPIService.startLoading();
		return this.http.get('/setup/getCity');
	}
	editBoard(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/board/${value.board_id}`, value);
	}
	editSection(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/section/${value.sec_id}`, value);

	}
	editSubject(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/subject/${value.sub_id}`, value);
	}
	editClass(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/classes/${value.class_id}`, value);

	}
	editTopic(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/topic/${value.topic_id}`, value);

	}
	editSubtopic(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/subtopic/${value.st_id}`, value);

	}
	editQsubtype(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/question_subtype/${value.qst_id}`, value);

	}
	editQtype(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/question_type/${value.qt_id}`, value);

	}
	editSkill(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/skilltype/${value.skill_id}`, value);
	}
	editLod(value: any) {
		this.commonAPIService.startLoading();
		return this.http.put(`/setup/difficulties_level/${value.dl_id}`, value);
	}
	deleteBoard(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/board/${delval.board_id}`);
	}
	deleteSection(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/section/${delval.sec_id}`);

	}
	deleteSubject(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/subject/${delval.sub_id}`);

	}

	deleteClass(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/classes/${delval.class_id}`);

	}
	deleteTopic(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/topic/${delval.topic_id}`);

	}
	deleteSubtopic(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/subtopic/${delval.st_id}`);

	}
	deleteQsubtype(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/question_subtype/${delval.qst_id}`);

	}
	deleteQtype(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/question_type/${delval.qt_id}`);

	}
	deleteSkill(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/skilltype/${delval.skill_id}`);
	}
	deleteLod(delval: any) {
		this.commonAPIService.startLoading();
		return this.http.delete(`/setup/difficulties_level/${delval.dl_id}`);
	}

	getSubjecstByClass(class_id: any) {
		const param: any = {};
		if (class_id) {
			param.class_id = class_id;
		}
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getSubjectsByClass', param);
	}
	getTopicByBoardClassSubject(board_id: any, class_id: any, sub_id: any) {
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getTopicByBoardClassSubject', { board_id: board_id, class_id: class_id, sub_id: sub_id });
	}
	getTopicByClassSubject(value) {
		const param: any = {};
		if (value.board_id) {
			param.board_id = value.board_id;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.sub_id) {
			param.sub_id = value.sub_id;
		}
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getTopicByBoardClassSubject', param);
	}
	// copied form other axion services
	getSchool() {
		this.commonAPIService.startLoading();
		return this.http.get('/dashboard/getSchool');
	}
	getSubjectsByClass(class_id) {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.class_id = class_id;
		if (this.currentUser.role_id === '3' || this.currentUser.role_id === '1') {
			param.login_id = this.currentUser.login_id;
		}
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getSubjectsByClass', param);
	}
	getSectionsByClass(class_id) {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.class_id = class_id;
		if (this.currentUser.role_id === '3') {
			param.login_id = this.currentUser.login_id;
		}
		this.commonAPIService.startLoading();
		return this.http.post('/setupdetail/getSectionsByClass', param);
	}
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
