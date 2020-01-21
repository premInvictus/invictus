import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class ExamService {
	private processType;
	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getGradeSet(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamGradeSet', value);
	}
	getRemarkSet(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getRemarkSet', value);
	}
	getExamActivity(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamActivity', value);
	}
	getExamActivityCategory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamActivityCategory', value);
	}
	getExamActivityType(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamActivityType', value);
	}
	getExamCalculation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamCalculation', value);
	}
	insertExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertExam', value);
	}
	updateExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateExam', value);
	}
	insertSubExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertSubExam', value);
	}
	getSubExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getSubExam', value);
	}
	updateSubExamStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateSubExamStatus', value);
	}
	insertExamGradeSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertExamGradeSet', value);
	}

	insertExamRemarkSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertRemarkSet', value);
	}
	insertExamActivitySetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertExamActivity', value);
	}
	getExamDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getExamDetails', value);
	}
	deleteExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/deleteExam', value);
	}
	insertReportCardSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertReportCardSetup', value);
	}
	insertRollNo(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertRollNo', value);
	}
	updateRollNo(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/updateRollNo', value);
	}
	getRollNoUser(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getRollNoUser', value);
	}
	checkRollNoForClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/checkRollNoForClass', value);
	}
	getAdditionalSubjectUser(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getAdditionalSubjectUser', value);
	}
	insertAdditionalSubject(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertAdditionalSubject', value);
	}
	updateAdditionalSubject(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/updateAdditionalSubject', value);
	}
	checkAdditionalSubjectForClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/checkAdditionalSubjectForClass', value);
	}

	getTermStudentAttendence2(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTermStudentAttendence2', value);
	}

	addMarksEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/marksEntry/addMarksEntry', value);
	}
	getMarksEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/marksEntry/getMarksEntry', value);
	}	
	getMarksforRemarksEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/gradeMaster/getMarksforRemarksEntry', value);
	}
	getRemarksEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/gradeMaster/getRemarksEntry', value);
	}
	addReMarksEntry(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/gradeMaster/addReMarksEntry', value);
	}
	getStudentAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/gradeMaster/getStudentAttendance', value);
	}
	getUserAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getUserAttendance', value);
	}
	insertAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertAttendance', value);
	}
	checkAttendanceForClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/checkAttendanceForClass', value);
	}
	updateAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/updateAttendance', value);
	}
	getClassTerm(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/common/getClassTerm', value);
	}
	getGradeCardMark(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getGradeCardMark', value);
	}
	getIsBoardClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/common/getIsBoardClass', value);
	}
	insertMarksAnalysis(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertMarksAnalysis', value);
	}
	getMarksAnalysis(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getMarksAnalysis', value);
	}
	getTopFiveSubjects(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTopFiveSubjects', value);
	}
	getSubjectWiseAnalysis(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getSubjectWiseAnalysis', value);
	}
	lockUnlockGradeCard(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/lockUnlockGradeCard', value);
	}
	getClassGradeset(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getClassGradeset', value);
	}
	insertClassTermGrade(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertClassTermGrade', value);
	}
	getClassTermGrade(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getClassTermGrade', value);
	}
	getGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}
	updateGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/updateGlobalSetting', value);
	}
	
	getTopTenDataPerSubject(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTopTenDataPerSubject', value);
	}
	deleteClassTermGrade(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/deleteClassTermGrade', value);
	}
	getDropdownGradeSet(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getDropdownGradeSet', value);
	}



	ctForClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/ctForClass', value);
	}
	getRemarksEntryStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/gradeMaster/getRemarksEntryStudent', value);
	}
	printGradecard(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/printGradecard', value);
	}
	getMarksRegister(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/report/getMarksRegister', value);
	}
	getAdditionalSubjectForClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/marksEntry/getAdditionalSubjectForClass', value);
	}
	downloadMarkEntryTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/marksEntry/downloadMarkEntryTemplate', value);
	}
	uploadMarkEntryTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/marksEntry/uploadMarkEntryTemplate', value);
	}
	addSubjectSubexamMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/addSubjectSubexamMapping', value);
	}
	getSubjectSubexamMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getSubjectSubexamMapping', value);
	}
	sessionWisePerformance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/sessionWisePerformance', value);
	}
	yearWisePerformance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/yearWisePerformance', value);
	}
	getStudentSubjects(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getStudentSubjects', value);
	}
	getClassStudentSubjects(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getClassStudentSubjects', value);
	}
	insertExamSubjectStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertExamSubjectStudent', value);
	}
	updateExamSubjectStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/updateExamSubjectStudent', value);
	}
	getClassHighestAndAverage(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getClassHighestAndAverage', value);
	}
	getTermStudentAttendence(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTermStudentAttendence', value);
	}
	getTermWorkingAndHoliday(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTermWorkingAndHoliday', value);
	}
	getStudentAttendence(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/report/getStudentAttendence', value);
	}
	insertClassTermDate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertClassTermDate', value);
	}
	getClassTermDate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getClassTermDate', value);
	}
	getTermAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getTermAttendance', value);
	}
	insertTermAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertTermAttendance', value);
	}
	updateTermAttendance(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/updateTermAttendance', value);
	}
	insertBMI(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertBMI', value);
	}
	getBMI(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getBMI', value);
	}
	getUserAchievement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/getUserAchievement', value);
	}
	checkAchievement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/checkAchievement', value);
	}
	insertAchievement(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/auxiliaries/insertAchievement', value);
	}
	getFailureList(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/report/getFailureList', value);
	}
	getComparativeList(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/report/getComparativeList', value);
	}
}


