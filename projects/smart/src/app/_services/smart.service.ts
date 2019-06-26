import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SmartService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getSubjectByTeacherId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSubjectByTeacherId', value);
	}
	getClassByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getClassByTeacherIdSubjectId', value);
	}
	getClassSectionByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getClassSectionByTeacherIdSubjectId', value);
	}
	getClassByTeacherId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getClassByTeacherId', value);
	}
	getSubjectByTeacherIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSubjectByTeacherIdClassId', value);
	}
	getSectionByTeacherIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSectionByTeacherIdClassId', value);
	}
	getSubjectByTeacherIdClassIdSectionId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSubjectByTeacherIdClassIdSectionId', value);
	}
	getSectionByTeacherIdSubjectIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSectionByTeacherIdSubjectIdClassId', value);
	}
	getTopicByClassIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getTopicByClassIdSubjectId', value);
	}
	getSubtopicByTopicId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getSubtopicByTopicId', value);
	}
	getSubtopicCountAndDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/topicwise/getSubtopicCountAndDetail', value);
	}
	getTopicwiseCTR(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/topicwise/getTopicwiseCTR', value);
	}
	classworkInsert(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/insert', value);
	}
	getClasswork(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/classwork/getClasswork', value);
	}

	//////////////////////// Syllabus Service Function //////////////////////
	topicwiseInsert(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/topicwise/insert', value);
	}
	ctrList() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/smtsyllabus/ctrList');
	}
	getTermList() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/smtsyllabus/getTermList');
	}
	insertSyllabus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/insert', value);
	}
	getSyllabus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/get_syllabus', value);
	}
	insertSyllabusDetails(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/insertSyllabusDetails', value);
	}
	getSylIdByClassSubject(class_id: any, sub_id: any) {
		const param: any = {};
		param.syl_class_id = class_id;
		param.syl_sub_id = sub_id;
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getSylIdByClassSubject', param);
	}
	getSyllabusDetails(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getSyllabusDetails', value);
	}
	deleteSyllabusDetails(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/updateSyllabusDetails', value);
	}
	updateSyllabusEditDetails(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/updateSyllabusDetails', value);
	}
	getSyllabusDetailsEdit(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getSyllabusDetailsEdit', value);
	}
	insertPublishSyllabus(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/insertPublishSyllabus', value);
	}
	updatePublishStatus(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/updatePublishStatus', value);
	}
	getTopicNameById(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getTopicNameById', value);
	}
	getSubTopicNameById(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getSubTopicNameById', value);
	}
	insertTimetable(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/Smttimetable/insertTimetable', value);
	}
	insertTimetableDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/Smttimetable/insertTimetableDetails', value);
	}
}
