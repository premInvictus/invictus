import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SmartService {
	private processType;
	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getSubjectByTeacherId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectByTeacherId', value);
	}
	getClassByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassByTeacherIdSubjectId', value);
	}
	getClassSectionByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassSectionByTeacherIdSubjectId', value);
	}
	getClassByTeacherId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassByTeacherId', value);
	}
	getSubjectByTeacherIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectByTeacherIdClassId', value);
	}
	getSectionByTeacherIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionByTeacherIdClassId', value);
	}
	getSubjectByTeacherIdClassIdSectionId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectByTeacherIdClassIdSectionId', value);
	}
	getSectionByTeacherIdSubjectIdClassId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionByTeacherIdSubjectIdClassId', value);
	}
	getTopicByClassIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getTopicByClassIdSubjectId', value);
	}
	getSubtopicByTopicId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubtopicByTopicId', value);
	}
	getSchedulerEventCategory() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/common/getSchedulerEventCategory');
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
	updateClasswork(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSmartUrl + '/classwork/updateClasswork', value);
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
	cwCtrList() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/smtsyllabus/cwCtrList');
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
		return this.http.post(environment.apiSmartUrl + '/common/getTopicNameById', value);
	}
	getSubTopicNameById(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubTopicNameById', value);
	}
	assignmentInsert(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/assignment/insert', value);
	}
	assignmentUpdate(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSmartUrl + '/assignment/update', value);
	}
	assignmentDelete(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/assignment/deleteAssignment', value);
	}
	getAssignment(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/assignment/getAssignment', value);
	}
	sendAssignment(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/assignment/sendAssignment', value);
	}
	insertTimetable(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/insertTimetable', value);
	}
	insertTimetableDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/insertTimetableDetails', value);
	}
	downloadTimeTableExcel(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/excelimportexport/downloadTimeTableExcel', value);
	}
	downloadSyllabusExcel(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/excelimportexport/downloadSyllabusExcel', value);
	}
	getTimeTableId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getTimeTableId', value);
	}
	getClasswiseDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getClasswiseDetails', value);
	}
	getTeacherwiseTableDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getTeacherwiseTableDetails', value);
	}
	updateTimetableDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/updateTimetableDetails', value);
	}
	insertScheduler(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/scheduler/insertScheduler', value);
	}
	getScheduler(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/scheduler/getScheduler', value);
	}
	deleteScheduler(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/scheduler/deleteScheduler', value);
	}
	insertClasswisePeriod(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/insertClasswisePeriod', value);
	}
	getDetailsCdpRelation() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/setup/getDetailsCdpRelation');
	}
	updateClasswisePeriod(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/updateClasswisePeriod', value);
	}
	checkClassEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/checkClassEntry', value);
	}
	deleteClassEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/deleteClassEntry', value);
	}
	getPeriodDayByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/getPeriodDayByClass', value);
	}
	datediffInWeeks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/datediffInWeeks', value);
	}
	subjectPeriodCounter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/subjectPeriodCounter', value);
	}
	periodWiseSummary(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/periodWiseSummary', value);
	}
	weekCounter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smttimetable/weekCounter', value);
	}
	getViewSyllabusDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getViewSyllabusDetails', value);
	}
	getMaxPeriod() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/setup/getMaxPeriod');
	}
	getComparativeDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/getComparativeDetails', value);
	}
	syllabusProgessReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/syllabusProgessReport', value);
	}
	cwSyllabusProgessReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/cwSyllabusProgessReport', value);
	}
	insertProgressReportRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/insertProgressReportRemarks', value);
	}
	updateProgressReportRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/updateProgressReportRemarks', value);
	}
	deleteProgressReportRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/deleteProgressReportRemarks', value);
	}
	getProgressReportRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtreport/getProgressReportRemarks', value);
	}
	GetHolidayDays(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/GetHolidayDays', value);
	}
	syllabusPeriodCount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/syllabusPeriodCount', value);
	}
	getUserName() {
		this.service.startLoading();
		return this.http.get(environment.apiSmartUrl + '/common/getUserName');
	}
	getSyllabusTopicId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/getSyllabusTopicId', value);
	}
	addSubtopicByTopicwise(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/smtsyllabus/addSubtopicByTopicwise', value);
	}
	getTopicNameByTopicId(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getTopicNameByTopicId', value);
	}
	setProcesstype(value) {
		this.processType = value;
	}
	getProcesstype() {
		if (this.processType) {
			return this.processType;
		}
	}
	resetProcesstype() {
		this.processType = null;
	}
}
