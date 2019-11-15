import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { appConfig } from '../../app.config';
import { LoaderService, NotificationService } from '../../_services/index';
import { environment } from 'src/environments/environment';
@Injectable()
export class QelementService {

	private qelementBaseUrl: string = appConfig.apiUrl + '/api/qelement';
	currentUser: any = {};
	examTypeArray: any = [
		{ exam_type_id: '1', exam_type_name: 'Class' },
		{ exam_type_id: '2', exam_type_name: 'Home' }
	];
	constructor(
		private _http: HttpClient,
		private loaderService: LoaderService,
		private notificationService: NotificationService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	// fetch board
	getBoard() {
		this.loaderService.startLoading();
		return this._http.get('/setup/board');
	}
	// fetch class
	getClass() {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		if (this.currentUser.role_id === '3' || this.currentUser.role_id === '1') {
			param.login_id = this.currentUser.login_id;
		}
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/setupdetail/getClassData', param);
	}

	getSubtopicNameById(value) {
		return this._http.get(environment.apiAxiomUrl + `/setup/subtopic/1/${value}`);
	}
	getTopicNameById(value) {
		return this._http.get(environment.apiAxiomUrl + `/setup/topic/1/${value}`);
	}

	getQuestionSubtypeNameById(value) {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `/setup/question_subtype/1/${value}`);
	}
	// fetch test list
	getTest() {
		return this._http.get(environment.apiAxiomUrl + '/examsetup/getTest');
	}

	// fetch start date
	getDate() {

		return this._http.get(environment.apiAxiomUrl + '/examsetup/getTest');
	}


	// fetch subject based on class id
	getSubjectsByClass(class_id) {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.class_id = class_id;
		if (this.currentUser.role_id === '3' || this.currentUser.role_id === '1') {
			param.login_id = this.currentUser.login_id;
		}
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/setupdetail/getSubjectsByClass', param);
	}

	// fetch section based on class id
	getSectionsByClass(class_id) {
		const param: any = {};
		param.role_id = this.currentUser.role_id;
		param.class_id = class_id;
		if (this.currentUser.role_id === '3') {
			param.login_id = this.currentUser.login_id;
		}
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/setupdetail/getSectionsByClass', param);
	}

	// fetch topic
	getTopicByClassSubject(class_id, subject_id) {
		const param: any = {};
		if (this.currentUser.role_id === '1') {
			param.role_id = this.currentUser.role_id;
			param.login_id = this.currentUser.login_id;
		}
		if (class_id) {
			param.class_id = class_id;
		}
		if (subject_id) {
			param.sub_id = subject_id;
		}
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/setupdetail/getTopicByBoardClassSubject', param);
	}
	getQuestionsReview(qst_id, class_id, subject_id, topic_id, st_id, from_date, to_date) {
		// tslint:disable-next-line:max-line-length
		return this._http.post(environment.apiAxiomUrl + '/question/getQuestion', { qst_id: qst_id, class_id: class_id, subject_id: subject_id, topic_id: topic_id, from_date: from_date, to_date: to_date });
	}
	getQuestionsInTemplate(value) {
		const param: any = {};
		if (value.qus_id) {
			param.qus_id = value.qus_id;
		}
		if (value.qm_id) {
			param.qm_id = value.qm_id;
		}
		if (value.qt_id) {
			param.qt_id = value.qt_id;
		}
		if (value.qst_id) {
			param.qst_id = value.qst_id;
		}
		if (value.st_id) {
			param.st_id = value.st_id;
		}
		if (value.skill_id) {
			param.skill_id = value.skill_id;
		}
		if (value.dl_id) {
			param.dl_id = value.dl_id;
		}
		if (value.qus_marks) {
			param.qus_marks = value.qus_marks;
		}
		if (value.qus_limit) {
			param.qus_limit = value.qus_limit;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.subject_id) {
			param.subject_id = value.subject_id;
		}
		if (value.sub_id) {
			param.sub_id = value.sub_id;
		}
		if (value.topic_id) {
			param.topic_id = value.topic_id;
		}
		if (value.ess_id) {
			param.ess_id = value.ess_id;
		}
		if (value.exam_flag) {
			param.exam_flag = value.exam_flag;
		}
		if (value.status >= 0) {
			param.status = value.status;
		}
		if (value.bm_login_id) {
			param.bm_login_id = value.bm_login_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/question/getQuestion', param);
	}

	addQuestionPaper(value) {
		return this._http.post(environment.apiAxiomUrl + '/questionpaper/addQuestionPaper', value);
	}
	getJeeQuestionPaper(value) {
		return this._http.post(environment.apiAxiomUrl + '/assessment/getJeeQuestionPaper', value);
	}

	addExpressQuestionPaper(value) {
		return this._http.post(environment.apiAxiomUrl + '/questionpaper/addExpressQuestionPaper', value);
	}

	updateQuestionPaper(value) {
		return this._http.put(environment.apiAxiomUrl + `/questionpaper/updateQuestionPaper`, value);
	}
	checkUserStatus(value) {
		return this._http.put(environment.apiAxiomUrl + `/users/checkUserExists`, value);
	}

	getQuestionPaper(value) {
		const param: any = {};
		if (value.qp_id) {
			param.qp_id = value.qp_id;
		}
		if (value.class_id) {
			param.qp_class_id = value.class_id;
		}
		if (value.sec_id) {
			param.qp_sec_id = value.sec_id;
		}
		if (value.sub_id) {
			param.qp_sub_id = value.sub_id;
		}
		if (value.qp_qm_id) {
			param.qp_qm_id = value.qp_qm_id;
		}
		if (value.qp_status) {
			param.qp_status = value.qp_status;
		}
		return this._http.post(environment.apiAxiomUrl + '/questionpaper/getQuestionPaper', param);
	}
	generateExcelFileBoard(value) {
		const param: any = {};
		// no api
	}
	generateExcelFileSection(value) {
		const param: any = {};
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/sectionGenerateExcel', param);
	}
	generateExcelFileSubject(value) {
		const param: any = {};
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/subjectGenerateExcel', param);
	}
	generateExcelFileClass(value) {
		const param: any = {};
		if (value.board_id) {
			param.board_id = value.board_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/classGenerateExcel', param);
	}
	generateExcelFileTopic(value) {
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
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/topicGenerateExcel', param);
	}
	generateExcelFileSubtopic(value) {
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
		if (value.topic_id) {
			param.topic_id = value.topic_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/subtopicGenerateExcel', param);
	}
	userGenerateExcel(value) {
		const param: any = {};
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/bulkupload/userGenerateExcel', param);
	}
	public uploadExcelFileSection(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/sectionUpload', formData)
				;
		}

	}
	public uploadExcelFileSubject(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/subjectUpload', formData)
				;
		}

	}
	public uploadExcelFileClass(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/classUpload', formData)
				;
		}

	}
	public uploadExcelFileTopic(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/topicUpload', formData)
				;
		}

	}
	public uploadExcelFileSubtopic(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/subtopicUpload', formData)
				;
		}
	}
	public userUpload(uploadedFile, role_id) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			formData.append('role_id', role_id);
			return this._http.post(environment.apiAxiomUrl + '/bulkupload/userUpload', formData)
				;
		}

	}
	deleteQuestionPaper(value) {
		return this._http.delete(environment.apiAxiomUrl + `/questionpaper/deleteQuestionPaper/${value.qp_id}`);
	}
	publishUnpublishQuestionPaper(qp_id, qp_status, qp_unpublish_remark, reason_id, unpublish_by_login_id) {
		// tslint:disable-next-line:max-line-length
		return this._http.put(environment.apiAxiomUrl + `/questionpaper/publishUnpublishQuestionPaper/${qp_id}`, { qp_status, qp_unpublish_remark, reason_id, unpublish_by_login_id });
	}
	public addTemplate(value: any) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/addTemplate', value);
	}

	getSpecificList(tt_id, tp_status, class_id, subject_id) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate',
			{ tt_id: tt_id, tp_status: tp_status, class_id: class_id, sub_id: subject_id });
	}



	getAllSpecificList(value) {
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { tt_id: value.tt_id, tp_status: value.tp_status });
	}
	getTemplate(value) {
		const param: any = {};
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (currentUser.role_id === '3') {
			param.login_id = currentUser.login_id;
		}
		if (value.tp_id) {
			param.tp_id = value.tp_id;
		}
		if (value.tp_tt_id) {
			param.tt_id = value.tp_tt_id;
		}
		if (value.tt_id) {
			param.tt_id = value.tt_id;
		}
		if (value.tp_status !== '') {
			param.tp_status = value.tp_status;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.subject_id) {
			param.sub_id = value.subject_id;
		}
		if (value.sub_id) {
			param.sub_id = value.sub_id;
		}
		if (value.sec_id) {
			param.sec_id = value.sec_id;
		}
		if (value.login_id) {
			param.login_id = value.login_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', param);
	}

	getGenericTemplate(tp_id) {
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { tp_id });
	}
	getGenericList(tt_id, tp_status) {
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { tt_id: tt_id, tp_status: tp_status });
	}
	getExpressTemplate(tt_id, tp_status) {
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { tt_id: tt_id, tp_status: tp_status });
	}

	getAllGenericList(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { tt_id: value.tt_id, tp_status: value.tp_status });
	}
	updateTemplate(value) {
		this.loaderService.startLoading();
		return this._http.put(environment.apiAxiomUrl + '/questiontemplate/updateTemplate', value);
	}
	publishUnpublishTemplate(tp_id, tp_status, tp_unpublish_remark, reason_id, unpublish_by_login_id) {
		// tslint:disable-next-line:max-line-length
		return this._http.put(environment.apiAxiomUrl + `/questiontemplate/publishUnpublishTemplate/${tp_id}`, { tp_status, tp_unpublish_remark, reason_id, unpublish_by_login_id });
	}
	deleteTemplate(tp_id) {
		this.loaderService.startLoading();
		return this._http.delete(environment.apiAxiomUrl + `/questiontemplate/deleteTemplate/${tp_id}`);
	}

	getTemplateReview(class_id, subject_id) {
		return this._http.post(environment.apiAxiomUrl + '/questiontemplate/getTemplate', { class_id: class_id, subject_id: subject_id });
	}

	getQuestionTypeData() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/setupdetail/getQuestionTypeData');
	}

	getQuestionSubtypeDataByQuestiontype(questionType_id) {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `/setupdetail/getQuestionSubtypeDataByQuestiontype/${questionType_id}`);
	}
	// fetch subtopic
	getSubtopicByTopic(topic_id) {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `/setupdetail/getSubtopicByTopic/${topic_id}`);
	}
	getSubtopic() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `${this.qelementBaseUrl}/subtopic`);
	}
	// fetch question type
	getQtype() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `${this.qelementBaseUrl}/qtype`);
	}
	// fetch sub question type
	getSubqtype() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + `${this.qelementBaseUrl}/subqtype`);
	}
	// fetch skill type
	getSkillData() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/setupdetail/getSkillData');
	}
	// fetch level of difficulty
	getLodData() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/setupdetail/getLodData');
	}
	// fetch marks
	getMark(es_qp_id) {
		return this._http.get(environment.apiAxiomUrl + `${this.qelementBaseUrl}/mark/${es_qp_id}`);
	}
	// fetch negative marks
	getNmark() {
		return this._http.get(environment.apiAxiomUrl + `${this.qelementBaseUrl}/nmark`);
	}
	publishUnpublishQuestion(qus_id, qus_status, qus_unpublish_remark, reason_id, unpublish_by_login_id, qus_role) {
		// tslint:disable-next-line:max-line-length
		return this._http.put(environment.apiAxiomUrl + '/question/publishUnpublishQuestion', { qus_id: qus_id, qus_status: qus_status, qus_unpublish_remark, reason_id, unpublish_by_login_id, qus_role });
	}

	/* publishUnpublishReason() {
    return this._http.get(environment.apiAxiomUrl + "/question/publishUnpublishReason")
      .map(this.handleSuccess.bind(this)).catch(this.catchError.bind(this));
  } */

	// publishUnpublishReason now calling sis api to get reason
	getFeePeriods(value) {
		this.loaderService.startLoading();
		return this._http.get(environment.apiFeeUrl + '/feeSetup/getFeePeriods', value);
	}

	publishUnpublishReason(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiSisUrl + '/setup/getReason', value);
	}
	deleteQuestion(qus_id) {
		return this._http.delete(environment.apiAxiomUrl + `/question/deleteQuestion/${qus_id}`);
	}
	insertQuestionBankDbSyncSetting(value) {
		return this._http.post(environment.apiAxiomUrl + '/question/insertQuestionBankDbSyncSetting', value);
	}
	getQuestionsFromMaster(value) {
		return this._http.post(environment.apiAxiomUrl + '/dbsync/getQuestionsFromMaster', value);
	}
	getQuestionBankDbSyncSetting(value) {
		return this._http.post(environment.apiAxiomUrl + '/question/getQuestionBankDbSyncSetting', value);
	}
	revokeDbSyncSetting(value) {
		return this._http.post(environment.apiAxiomUrl + '/dbsync/revokeDBSync', value);
	}
	addExamSetup(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/assessment/addExamSetup', value);
	}
	sendExamSetupSms(value) {
		// this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/assessment/sendExamSetupSms', value);
	}
	getExamType() {
		return of(this.examTypeArray);
	}
	/* getExamType() {
    const param: any = {};
    this.loaderService.startLoading();
    return this._http.post(environment.apiAxiomUrl + '/assessment/getExamType', param)
      .map(this.handleSuccess.bind(this)).catch(this.catchError.bind(this));
  } */
	updateExamSetup(value) {
		return this._http.put(environment.apiAxiomUrl + '/assessment/updateScheduledExam', value);
	}
	getScheduledExam(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/assessment/getScheduledExam', value);
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
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/users/getAllTeacher', param);
	}

	generateExcelFile(value) {
		return this._http.post(environment.apiAxiomUrl + '/question/downloadExcelFile', value);
	}
	getSchool() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}

	getLabInfo() {
		return this._http.get(environment.apiAxiomUrl + '/setup/getLabInfo');

	}

	getUser(value) {
		this.loaderService.startLoading();
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
		return this._http.post(environment.apiAxiomUrl + '/users/getUser', param);
	}
	// get class, section and subject from their respective global table
	getGlobalTeacher(value) {
		this.loaderService.startLoading();
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
		return this._http.post(environment.apiAxiomUrl + '/users/getGlobalTeacher', param);
	}
	getEditableUser(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/users/getUser', value);
	}

	addUser(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/users/addUser', value);
	}
	updateUser(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/users/updateUser', value);
	}

	addExamAttendance(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/evaluation/addExamAttendance', value);
	}
	updateStartTime(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/evaluation/updateStartTime', value);
	}
	getExamAttendance(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.es_id) {
			param.eva_es_id = value.es_id;
		}
		if (value.login_id) {
			param.eva_login_id = value.login_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/evaluation/getExamAttendance', param);
	}
	extendSession(es_id) {
		this.loaderService.startLoading();
		return this._http.put(environment.apiAxiomUrl + '/evaluation/extendSession', { es_id: es_id });
	}
	studentFinalSubmit(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.eva_id) {
			param.eva_id = value.eva_id;
		}
		if (value.login_id) {
			param.eva_login_id = value.login_id;
		}
		if (value.eva_status) {
			param.eva_status = value.eva_status;
		}
		if (value.es_exam_type) {
			param.es_exam_type = value.es_exam_type;
		}
		if (value.es_id) {
			param.es_id = value.es_id;
		}
		if (value.allresponses) {
			param.allresponses = value.allresponses;
		}
		return this._http.put(environment.apiAxiomUrl + '/evaluation/studentFinalSubmit', param);
	}
	teacherFinalSubmit(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.eva_id) {
			param.eva_id = value.eva_id;
		}
		if (value.login_id) {
			param.eva_login_id = value.login_id;
		}
		if (value.eva_status) {
			param.eva_status = value.eva_status;
		}
		return this._http.put(environment.apiAxiomUrl + '/evaluation/teacherFinalSubmit', param);
	}

	publishUnpublishScheduledExam(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.es_id) {
			param.es_id = value.es_id;
		}
		if (value.es_status) {
			param.es_status = value.es_status;
		}
		return this._http.put(environment.apiAxiomUrl + '/assessment/publishUnpublishScheduledExam', param);
	}

	studentWiseAnswerReview(eva_id) {
		return this._http.post(environment.apiAxiomUrl + '/evaluation/studentWiseAnswerReview', { evd_eva_id: eva_id });
	}
	studentWiseAnswerReview1(value) {
		this.loaderService.startLoading();
		const param: any = {};
		if (value.evd_eva_id) {
			param.evd_eva_id = value.evd_eva_id;
		}
		if (value.evd_qt_id) {
			param.evd_qt_id = value.evd_qt_id;
		}
		if (value.evd_qus_id) {
			param.evd_qus_id = value.evd_qus_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/evaluation/studentWiseAnswerReview', param);
	}

	teacherInputMark(value) {
		this.loaderService.startLoading();
		return this._http.put(environment.apiAxiomUrl + '/evaluation/teacherInputMark', value);

	}
	teacherEndSession(value) {
		this.loaderService.startLoading();
		return this._http.put(environment.apiAxiomUrl + '/evaluation/teacherEndSession', value);
	}
	getTeacherInputMark(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/evaluation/getTeacherInputMark', value);
	}

	studentInputAnswer(value) {
		return this._http.post(environment.apiAxiomUrl + '/evaluation/studentInputAnswer', value);
	}
	studentClearResponse(value) {
		return this._http.post(environment.apiAxiomUrl + '/evaluation/studentClearResponse', value);
	}
	examQuestionStatus(value) {
		const param: any = {};
		if (value.evd_eva_id) {
			param.evd_eva_id = value.evd_eva_id;
		}
		if (value.evd_qt_id) {
			param.evd_qt_id = value.evd_qt_id;
		}
		if (value.evd_qus_id) {
			param.evd_qus_id = value.evd_qus_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/evaluation/examQuestionStatus', param);
	}

	getCountry() {
		return this._http.get(environment.apiAxiomUrl + '/setup/getCountry');
	}
	getState() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/setup/getState');
	}
	getCity() {
		this.loaderService.startLoading();
		return this._http.get(environment.apiAxiomUrl + '/setup/getCity');
	}
	deleteUser(value) {
		this.loaderService.startLoading();
		return this._http.delete(environment.apiAxiomUrl + `/users/deleteUser/${value.au_login_id}`);
	}
	changeUserStatus(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiAxiomUrl + '/users/changeUserStatus', value);
	}

	deleteScheduledExam(value) {
		const param: any = {};
		if (value.es_id) {
			param.es_id = value.es_id;
		}

		return this._http.delete(environment.apiAxiomUrl + `/assessment/deleteScheduledExam/${param.es_id}`);
	}

	// Essay api
	getEssay(value) {
		const param: any = {};
		if (value.ess_status !== '') {
			param.ess_status = value.ess_status;
		}
		if (value.ess_class_id) {
			param.ess_class_id = value.ess_class_id;
		}
		if (value.ess_sub_id) {
			param.ess_sub_id = value.ess_sub_id;
		}
		if (value.ess_topic_id) {
			param.ess_topic_id = value.ess_topic_id;
		}
		if (value.ess_st_id) {
			param.ess_st_id = value.ess_st_id;
		}
		if (value.ess_id) {
			param.ess_id = value.ess_id;
		}
		return this._http.post(environment.apiAxiomUrl + '/essay/getEssay', param);
	}
	addEssay(value) {
		const param: any = {};
		if (value.ess_class_id) {
			param.ess_class_id = value.ess_class_id;
		}
		if (value.ess_sub_id) {
			param.ess_sub_id = value.ess_sub_id;
		}
		if (value.ess_topic_id) {
			param.ess_topic_id = value.ess_topic_id;
		}
		if (value.ess_st_id) {
			param.ess_st_id = value.ess_st_id;
		}
		if (value.ess_title) {
			param.ess_title = value.ess_title;
		}
		if (value.ess_description) {
			param.ess_description = value.ess_description;
		}
		return this._http.post(environment.apiAxiomUrl + '/essay/addEssay', param);
	}
	updateEssay(value) {
		const param: any = {};
		if (value.ess_status !== '') {
			param.ess_status = value.ess_status;
		}
		if (value.ess_class_id) {
			param.ess_class_id = value.ess_class_id;
		}
		if (value.ess_sub_id) {
			param.ess_sub_id = value.ess_sub_id;
		}
		if (value.ess_topic_id) {
			param.ess_topic_id = value.ess_topic_id;
		}
		if (value.ess_st_id) {
			param.ess_st_id = value.ess_st_id;
		}
		if (value.ess_id) {
			param.ess_id = value.ess_id;
		}
		if (value.ess_title) {
			param.ess_title = value.ess_title;
		}
		if (value.ess_description) {
			param.ess_description = value.ess_description;
		}
		return this._http.put(environment.apiAxiomUrl + '/essay/updateEssay', param);
	}
	deleteEssay(value) {
		const param: any = {};
		if (value.ess_id) {
			param.ess_id = value.ess_id;
			return this._http.delete(environment.apiAxiomUrl + `/essay/deleteEssay/${param.ess_id}`)
				;
		}
	}
	uploadDocuments(value) {
		this.loaderService.startLoading();
		return this._http.post(environment.apiSisUrl + '/documents/uploadDocuments', value);
	}
}

