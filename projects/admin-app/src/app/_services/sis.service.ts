import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class SisService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	getEnrollmentStatus() {
		return of({
			status: 'ok', data: [
				{ enrol_id: 'active', enrol_name: 'Active' },
				{ enrol_id: 'left', enrol_name: 'Left' }
			]
		});
	}
	/* getGender() {
		return of({status: 'ok', data: [
			{gender_id: 'M', gender_name: 'Male'},
			{gender_id: 'F', gender_name: 'Female'}
		]});
	}
	getCategory() {
		return of({status: 'ok', data: [
			{cat_id: 'ST/SC', cat_name: 'ST/SC'},
			{cat_id: 'OBC', cat_name: 'OBC'},
			{cat_id: 'GEN', cat_name: 'GEN'}
		]});
	} */
	getClass(value) {
		const param: any = {};
		if (value.role_id === '3' || value.role_id === '1') {
			param.login_id = value.login_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getClassData', param);
	}
	getSectionsByClass(value) {
		const param: any = {};
		param.class_id = value.class_id;
		if (value.role_id) {
			param.role_id = value.role_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setupdetail/getSectionsByClass', param);
	}
	getSectionAll() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/section');
	}
	getQualifications() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/qualifications/getQualifications');
	}
	insertQualifications(value) {
		this.service.startLoading();
		return this.http.post('/qualifications/insertQualifications', value);
	}
	updateQualifications(value: any) {
		this.service.startLoading();
		return this.http.put('/qualifications/updateQualifications/' + value.qlf_id, value);
	}
	deleteQualifications(value: any) {
		this.service.startLoading();
		return this.http.delete('/qualifications/deleteQualifications/' + value.qlf_id);
	}
	getHouses() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/houses/getHouses');
	}
	insertHouses(value) {
		this.service.startLoading();
		return this.http.post('/houses/insertHouses', value);
	}
	updateHouses(value: any) {
		this.service.startLoading();
		return this.http.put('/houses/updateHouses/' + value.hou_id, value);
	}
	deleteHouses(value: any) {
		this.service.startLoading();
		return this.http.delete('/houses/deleteHouses/' + value.hou_id);
	}
	getAnnualIncome() {
		this.service.startLoading();
		return this.http.get('/annualIncome/getAnnualIncome');
	}
	insertAnnualIncome(value) {
		this.service.startLoading();
		return this.http.post('/annualIncome/insertAnnualIncome', value);
	}
	updateAnnualIncome(value: any) {
		this.service.startLoading();
		return this.http.put('/annualIncome/updateAnnualIncome/' + value.ai_id, value);
	}
	deleteAnnualIncome(value: any) {
		this.service.startLoading();
		return this.http.delete('/annualIncome/deleteAnnualIncome/' + value.ai_id);
	}
	getOccupationType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/occupationType/getOccupationType');
	}
	insertOccupationType(value) {
		this.service.startLoading();
		return this.http.post('/occupationType/insertOccupationType', value);
	}
	updateOccupationType(value: any) {
		this.service.startLoading();
		return this.http.put('/occupationType/updateOccupationType/' + value.ocpt_id, value);
	}
	deleteOccupationType(value: any) {
		this.service.startLoading();
		return this.http.delete('/occupationType/deleteOccupationType/' + value.ocpt_id);
	}
	getEducationDetails(value) {
		this.service.startLoading();
		return this.http.post('/educationDetails/getEducationDetails', value);
	}
	insertStudentDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentDetails/insertStudentDetails', value);
	}
	addStudent(value) {
		this.service.startLoading();
		return this.http.post('/studentinfo/addStudent', value);
	}
	insertStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentPersonalDetails/insertStudentPersonalDetails', value);
	}
	insertManagementRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/insertManagementRemarks', value);
	}
	insertEducationDetails(value) {
		this.service.startLoading();
		return this.http.post('/educationDetails/insertEducationDetails', value);
	}
	updateEducationDetails(value) {
		this.service.startLoading();
		return this.http.post('/educationDetails/updateEducationDetails', value);
	}
	updateStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.put(`/studentPersonalDetails/updateStudentPersonalDetails/${value.upd_login_id}`, value);
	}
	getStudentDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentDetails/getStudentDetails', value);
	}
	getStudentInformation(value) {
		this.service.startLoading();
		value.fromFee = 'fee';
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentInformation', value);
	}
	getStudentFamilyInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentFamilyInformation', value);
	}
	addStudentInformation(value) {
		this.service.startLoading();
		return this.http.post('/studentinfo/addStudentInformation', value);
	}
	getReligionDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/religionDetails/getReligionDetails', value);
	}
	insertReligionDetails(value) {
		this.service.startLoading();
		return this.http.post('/religionDetails/insertReligionDetails', value);
	}
	updateReligionDetails(value: any) {
		this.service.startLoading();
		return this.http.put('/religionDetails/updateReligionDetails/' + value.rel_id, value);
	}
	deleteReligionDetails(value: any) {
		this.service.startLoading();
		return this.http.delete('/religionDetails/deleteReligionDetails/' + value.rel_id);
	}
	getManagementRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/getManagementRemarks', value);
	}
	getMotherTongue(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/motherTongue/getMotherTongue', value);
	}
	insertMotherTongue(value) {
		this.service.startLoading();
		return this.http.post('/motherTongue/insertMotherTongue', value);
	}
	updateMotherTongue(value) {
		this.service.startLoading();
		return this.http.put('/motherTongue/updateMotherTongue/' + value.mt_id, value);
	}
	deleteMotherTongue(value) {
		this.service.startLoading();
		return this.http.delete('/motherTongue/deleteMotherTongue/' + value.mt_id);
	}
	updateStudentDetails(value) {
		this.service.startLoading();
		return this.http.put(`/studentDetails/updateStudentDetails/${value.au_login_id}`, value);
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
		this.service.startLoading();
		return this.http.post('/users/getUser', param);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getActivity() {
		this.service.startLoading();
		return this.http.get('/siSetup/activity');
	}
	insertActivity(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/activity', value);
	}
	updateActivity(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/activity/' + value.act_id, value);
	}
	deleteActivity(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/activity/' + value.act_id);
	}
	getLevelOfInterest() {
		this.service.startLoading();
		return this.http.get('/siSetup/levelOfInterest');
	}
	insertLevelOfInterest(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/levelOfInterest', value);
	}
	updateLevelOfInterest(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/levelOfInterest/' + value.loi_id, value);
	}
	deleteLevelOfInterest(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/levelOfInterest/' + value.loi_id);
	}
	getEventLevel() {
		this.service.startLoading();
		return this.http.get('/siSetup/eventLevel');
	}
	insertEventLevel(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/eventLevel', value);
	}
	updateEventLevel(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/eventLevel/' + value.el_id, value);
	}
	deleteEventLevel(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/eventLevel/' + value.el_id);
	}
	getActivityClub() {
		this.service.startLoading();
		return this.http.get('/siSetup/activityClub');
	}
	insertActivityClub(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/activityClub', value);
	}
	updateActivityClub(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/activityClub/' + value.acl_id, value);
	}
	deleteActivityClub(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/activityClub/' + value.acl_id);
	}
	getAuthority() {
		this.service.startLoading();
		return this.http.get('/siSetup/authority');
	}
	insertAuthority(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/authority', value);
	}
	updateAuthority(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/authority/' + value.aut_id, value);
	}
	deleteAuthority(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/authority/' + value.aut_id);
	}
	getCountry() {
		this.service.startLoading();
		return this.http.get('/setup/getCountry');
	}
	getNationality() {
		this.service.startLoading();
		return this.http.get('/siSetup/nationality');
	}
	getGender() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/gender');
	}
	getCategory() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/category');
	}
	getState() {
		this.service.startLoading();
		return this.http.get('/setup/getState/');
	}
	getStateCountryByCity(value: any) {
		this.service.startLoading();
		return this.http.post('/setup/getStateCountryByCity', value);
	}
	getCity() {
		this.service.startLoading();
		return this.http.get('/setup/getCity/1');
	}
	getReason(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getReason', value);
	}
	insertReason(value) {
		this.service.startLoading();
		return this.http.post('/setup/insertReason', value);
	}
	updateReason(value) {
		this.service.startLoading();
		return this.http.put('/setup/updateReason/' + value.reason_id, value);
	}
	deleteReason(value) {
		this.service.startLoading();
		return this.http.delete('/setup/deleteReason/' + value.reason_id);
	}
	getDepartment(value) {
		this.service.startLoading();
		return this.http.get('/siSetup/department');
	}
	getBloodGroup() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/bloodGroup/getBloodGroup');
	}
	insertBloodGroup(value) {
		this.service.startLoading();
		return this.http.post('/bloodGroup/insertBloodGroup', value);
	}
	updateBloodGroup(value: any) {
		this.service.startLoading();
		return this.http.put('/bloodGroup/updateBloodGroup/' + value.bg_id, value);
	}
	deleteBloodGroup(value: any) {
		this.service.startLoading();
		return this.http.delete('/bloodGroup/deleteBloodGroup/' + value.bg_id);
	}
	getVaccinationByDuration() {
		this.service.startLoading();
		return this.http.get('/vaccinationDuration/getVaccinationByDuration');
	}
	insertVaccinationByDuration(value) {
		this.service.startLoading();
		return this.http.post('/vaccinationDuration/insertVaccinationDuration', value);
	}
	updateVaccinationByDuration(value) {
		this.service.startLoading();
		return this.http.put('/vaccinationDuration/updateVaccinationDuration/' + value.vd_id, value);
	}
	deleteVaccinationDuration(value) {
		this.service.startLoading();
		return this.http.delete('/vaccinationDuration/deleteVaccinationDuration/' + value.vd_id);
	}
	getVaccinations() {
		this.service.startLoading();
		return this.http.get('/vaccinations/getVaccinations');
	}
	insertVaccinations(value) {
		this.service.startLoading();
		return this.http.post('/vaccinations/insertVaccinations', value);
	}
	updateVaccinations(value: any) {
		this.service.startLoading();
		return this.http.put('/vaccinations/updateVaccinations/' + value.vac_id, value);
	}
	deleteVaccinations(value: any) {
		this.service.startLoading();
		return this.http.delete('/vaccinations/deleteVaccinations/' + value.vac_id);
	}
	getMedications() {
		this.service.startLoading();
		return this.http.get('/medications/getMedications');
	}
	insertMedications(value) {
		this.service.startLoading();
		return this.http.post('/medications/insertMedications', value);
	}
	updateMedications(value: any) {
		this.service.startLoading();
		return this.http.put('/medications/updateMedications/' + value.med_id, value);
	}
	deleteMedications(value: any) {
		this.service.startLoading();
		return this.http.delete('/medications/deleteMedications/' + value.med_id);
	}
	getMedicalHistory(value) {
		this.service.startLoading();
		return this.http.post('/medicalHistory/getMedicalHistory', value);
	}
	insertMedicalHistory(value) {
		this.service.startLoading();
		this.service.startLoading();
		return this.http.post('/medicalHistory/insertMedicalHistory', value);
	}
	updateMedicalHistory(value) {
		this.service.startLoading();
		return this.http.post('/medicalHistory/updateMedicalHistory', value);
	}
	getArea() {
		this.service.startLoading();
		return this.http.get('/siSetup/area');
	}
	insertArea(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/area', value);
	}
	updateArea(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/area/' + value.ar_id, value);
	}
	deleteArea(value: any) {
		this.service.startLoading();
		return this.http.delete('/siSetup/area/' + value.ar_id);
	}
	getauthority() {
		this.service.startLoading();
		return this.http.get('/siSetup/authority');
	}
	insertGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/insertGeneralRemarks', value);
	}
	updateGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/updateGeneralRemarks', value);
	}
	deleteGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/deleteGeneralRemarks', value);
	}
	getGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/getGeneralRemarks', value);
	}
	getAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/getAdmissionRemarks', value);
	}
	getParentDetails(value) {
		this.service.startLoading();
		return this.http.post('/parentDetails/getParentDetails', value);
	}
	insertParentDetails(value) {
		this.service.startLoading();
		return this.http.post('/parentDetails/insertParentDetails', value);
	}
	updateParentDetails(value) {
		this.service.startLoading();
		return this.http.post('/parentDetails/updateParentDetails', value);
	}
	getSkillAwards(value) {
		return this.http.post('/skillsAwards/getSkillsAwards', value);
	}
	insertSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post('/skillsAwards/insertSkillsAwards', value);
	}
	updateSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post('/skillsAwards/updateSkillsAwards', value);
	}
	updateManagementRemarks(value) {
		this.service.startLoading();
		return this.http.put('/remarks/updateManagementRemarks', value);
	}
	deleteSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post('/skillsAwards/deleteSkillsAwards', value);
	}
	insertAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/insertAdmissionRemarks', value);
	}
	updateAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/updateAdmissionRemarks', value);
	}
	studentImageProfileUpload(value) {
		this.service.startLoading();
		return this.http.post('/studentDetails/studentImageProfileUpload', value);
	}
	deleteAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post('/remarks/deleteAdmissionRemarks', value);
	}
	uploadDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/uploadDocuments', value);
	}
	getDocumentRequired() {
		this.service.startLoading();
		return this.http.get('/documentRequired/getDocumentRequired');
	}
	insertDocumentRequired(value) {
		this.service.startLoading();
		return this.http.post('/documentRequired/insertDocumentRequired', value);
	}
	updateDocumentRequired(value: any) {
		this.service.startLoading();
		return this.http.put('/documentRequired/updateDocumentRequired/' + value.docreq_id, value);
	}
	deleteDocumentRequired(value: any) {
		this.service.startLoading();
		return this.http.delete('/documentRequired/deleteDocumentRequired/' + value.docreq_id);
	}
	insertDocuments(value) {
		this.service.startLoading();
		return this.http.post('/documents/insertDocuments', value);
	}
	getDocuments(value) {
		this.service.startLoading();
		return this.http.post('/documents/getDocuments', value);
	}
	deleteDocuments(value) {
		this.service.startLoading();
		return this.http.post('/documents/deleteDocuments', value);
	}
	updateDocuments(value) {
		this.service.startLoading();
		return this.http.post('/documents/updateDocuments', value);
	}
	verifyDocuments(value) {
		this.service.startLoading();
		return this.http.post('/documents/verifyDocuments', value);
	}
	getMasterStudentDetail(value) {
		this.service.startLoading();
		return this.http.post('/students/getAllStudents', value);
	}
	getStudent(value) {
		this.service.startLoading();
		return this.http.post('/studentinfo/getStudent', value);
	}
	getCountStudents(value) {
		this.service.startLoading();
		return this.http.post('/students/getCountStudents', value);
	}
	getSession() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}
	insertSession(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/session', value);
	}
	updateSession(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/session/' + value.ses_id, value);
	}
	deleteSession(value) {
		this.service.startLoading();
		return this.http.delete('/siSetup/session/' + value.ses_id);
	}
	getStudentsPromotionTool(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl +'/students/getAllStudents', value);
	}
	promoteStudents(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/promote', value);
	}
	demoteStudents(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/demote', value);
	}
	getShuffleStudents(value) {
		this.service.startLoading();
		return this.http.post('/students/getShuffleStudents', value);
	}
	getSuspendStudents(value) {
		this.service.startLoading();
		return this.http.post('/students/getSuspendStudents', value);
	}
	suspendStudent(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/suspend', value);
	}
	revokeStudent(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/revokeSuspend', value);
	}
	shuffle(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/shuffle', value);
	}
	getIdCardPrintSettings() {
		return this.http.get('/configure/getPrintSetting');
	}
	addIdCardPrintSettings(value) {
		return this.http.post('/configure/printSetting', value);
	}
	printApplication(value) {
		this.service.startLoading();
		return this.http.post('/students/printApplication', value);
	}
	changeEnrolmentNumber(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/changeEnrollmentNo', value);
	}
	changeEnrollmentStatus(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/changeEnrollmentStatus', value);
	}

	maxEnrollmentNo(value) {
		this.service.startLoading();
		return this.http.post('/auxiliaries/maxEnrollmentNo', value);
	}
	insertEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '3';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/insertEditRequest', value);
	}
	updateEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '3';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/updateEditRequest', value);
	}
	getEditRequest(value) {
		value.pro_id = '3';
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/getEditRequest', value);
	}
	getTemplate(value) {
		this.service.startLoading();
		return this.http.post('/notificationTemplate/getNotificationTemplate', value);
	}

	saveTemplate(value) {
		this.service.startLoading();
		return this.http.post('/notificationTemplate/insertNotificationTemplate', value);
	}

	updateTemplate(value) {
		this.service.startLoading();
		return this.http.post('/notificationTemplate/updateNotificationTemplate', value);
	}
	getTabBifurcation() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/configure/getTabBifurcation');
	}

	getProcessAdmission(value) {
		this.service.startLoading();
		return this.http.post('/admissionTool/processAdmission', value);
	}
	approveSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/approveSlcTc', value);
	}

	getSlcTc(value) {
		this.service.startLoading();
		const param: any = {};
		if (value.tc_fromdate) {
			param.tc_fromdate = value.tc_fromdate;
		}
		if (value.tc_todate) {
			param.tc_todate = value.tc_todate;
		}
		if (value.tc_approval_status) {
			param.tc_approval_status = value.tc_approval_status;
		}
		if (value.tc_admission_no) {
			param.tc_admission_no = value.tc_admission_no;
		}
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.sec_id) {
			param.sec_id = value.sec_id;
		}
		if (value.tc_id) {
			param.tc_id = value.tc_id;
		}
		return this.http.post('/slctc/getSlcTc', param);
	}
	insertSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/insertSlcTc', value);
	}
	issueSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/issueSlcTc', value);
	}
	cancelSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/cancelSlcTc', value);
	}
	reissueSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/reissueSlcTc', value);
	}
	insertEmailScheduler(value) {
		this.service.startLoading();
		return this.http.post('/notificationEmail/insertEmailScheduler', value);
	}

	insertEmailData(value) {
		this.service.startLoading();
		return this.http.post('/notificationEmail/insertEmailData', value);
	}

	sendEmail(value) {
		this.service.startLoading();
		return this.http.post('/notificationEmail/sendEmail', value);
	}

	getNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post('/notificationEmail/getNotificationEmail', value);
	}

	insertSMSScheduler(value) {
		this.service.startLoading();
		return this.http.post('/notificationSMS/insertSMSScheduler', value);
	}

	insertSMSData(value) {
		this.service.startLoading();
		return this.http.post('/notificationSMS/insertSMSData', value);
	}

	sendSMS(value) {
		this.service.startLoading();
		return this.http.post('/notificationSMS/sendSMS', value);
	}

	getNotificationSMS(value) {
		this.service.startLoading();
		return this.http.get('/notificationSMS/getNotificationSMS', value);
	}
	getFormFields(value) {
		this.service.startLoading();
		value.ff_project_id = '3';
		return this.http.post(environment.apiSisUrl + '/configure/getFormFields', value);
	}
	getFormFieldsForFilter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/configure/getFormFieldsForFilter', value);
	}

	migrgateProcessAdmission(value) {
		this.service.startLoading();
		return this.http.post('/admissionTool/migrateProcessAdmission', value);
	}

	uploadBulkDocuments(value) {
		this.service.startLoading();
		return this.http.post('/bulkUpdate/uploadBulkDocuments', value);
	}
	getStudentLastRecordPerProcessType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/studentDetails/getStudentLastRecordPerProcessType/fee');
	}
	insertConfigureSetting(value) {
		this.service.startLoading();
		return this.http.post('/configure/insertConfigureSetting', value);
	}
	getConfigureSetting(value) {
		this.service.startLoading();
		return this.http.post('/configure/getConfigureSetting', value);
	}
	getStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentPersonalDetails/getStudentPersonalDetails', value);
	}
	deleteStudentDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentDetails/deleteStudentDetails', value);
	}
	deleteNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post('/notificationEmail/deleteEmailScheduler', value);
	}
	deleteNotificationSMS(value) {
		this.service.startLoading();
		return this.http.post('/notificationSMS/deleteSMSScheduler', value);
	}
	getSchoolInstructions() {
		this.service.startLoading();
		return this.http.get('/schoolInstructions/getSchoolInstructions/external');
	}
	insertSchoolInstructions(value) {
		this.service.startLoading();
		return this.http.post('/schoolInstructions/insertSchoolInstructions', value);
	}
	updateSchoolInstructions(value: any) {
		this.service.startLoading();
		return this.http.post('/schoolInstructions/updateSchoolInstructions/' + value.schi_id, value);
	}
	deleteSchoolInstructions(value: any) {
		this.service.startLoading();
		return this.http.delete('/schoolInstructions/updateSchoolInstructions/', value);
	}
	generateReport(value: any) {
		this.service.startLoading();
		return this.http.post('/reportSis/generateReport', value);
	}
	insertSlcTcFormConfig(value) {
		this.service.startLoading();
		return this.http.post('/slctc/insertSlcTcFormConfig', value);
	}
	getSlcTcFormConfig(value) {
		return this.http.post('/slctc/getSlcTcFormConfig', value);
	}
	insertSlcTcTemplateSetting(value) {
		this.service.startLoading();
		return this.http.post('/slctc/insertSlcTcTemplateSetting', value);
	}
	getSlcTcTemplateSetting(value) {
		this.service.startLoading();
		return this.http.post('/slctc/getSlcTcTemplateSetting', value);
	}
	insertTemplateMapping(value) {
		this.service.startLoading();
		return this.http.post('/slctc/insertTemplateMapping', value);
	}
	getSlcTcPrintSetting(value) {
		this.service.startLoading();
		return this.http.post('/slctc/getSlcTcPrintSetting', value);
	}
	insertSlcTcPrintSetting(value) {
		this.service.startLoading();
		return this.http.post('/slctc/insertSlcTcPrintSetting', value);
	}
	generateReportClassWise(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/generateReportClasswise', value);
	}
	generateReportProcessWise(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/generateReportProcessWise', value);
	}
	generateStudentStrengthSummaryReport(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/generateStudentStrengthSummaryReport', value);
	}
	generateStudentStrengthDetailReport(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/generateStudentStrengthDetailReport', value);
	}
	getStudentSiblingDetails(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getStudentSiblingDetails', value);
	}
	getAluminiStudentDetails(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getAluminiStudentDetails', value);
	}
	getStudentReportDetails(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getStudentDetails', value);
	}
	getStudentDocumentReport(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getStudentDocumentReport', value);
	}
	getStudentBirthdayReport(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getStudentBirthdayReport', value);
	}
	printRequestSlcTc(value) {
		this.service.startLoading();
		return this.http.post('/slctc/printRequestSlcTc', value);
	}
	getSkillAwardsReportDetails(value) {
		this.service.startLoading();
		return this.http.post('/reportSis/getSkillAwardsReportDetails', value);
	}
	getAdditionalDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentinfo/getAdditionalDetails', value);
	}
	addAdditionalDetails(value) {
		this.service.startLoading();
		return this.http.post('/studentinfo/addAdditionalDetails', value);
	}
	getStudentRemarkDataThemeTwo(value) {
		if (value) {
			this.service.startLoading();
			return this.http.post('/studentinfo/getRemarks', value);
		}
	}
	saveStudentRemarkDataThemeTwo(value) {
		if (value) {
			this.service.startLoading();
			return this.http.post('/studentinfo/addRemarks', value);
		}
	}
	getCountStudentDashboard() {
		this.service.startLoading();
		return this.http.get('/dashboardSis/getCountStudentDashboard');
	}

	getStudentClasswiseDashboard() {
		this.service.startLoading();
		return this.http.get('/dashboardSis/getStudentClasswiseDashboard');
	}

	getStudentBirthdayDashboard() {
		this.service.startLoading();
		return this.http.get('/dashboardSis/getStudentBirthdayDashboard');
	}

	getNotificationsDashboard() {
		this.service.startLoading();
		return this.http.get('/dashboardSis/getNotificationsDashboard');
	}
	uploadBulkData(uploadedFile: any) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('zip_file', file, file.name);
			this.service.startLoading();
			return this.http.post('/bulkUploadSis/uploadBulkData', formData);
		}
	}
	generateExcelForBulkUpload() {
		this.service.startLoading();
		return this.http.get('/bulkUploadSis/generateExcelForBulkUpload');
	}
	validateUploadBulkData(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('excel_file', file, file.name);
			this.service.startLoading();
			return this.http.post('/bulkUploadSis/validateUploadBulkData', formData);
		}
	}
	getcategory() {
		this.service.startLoading();
		return this.http.get('/siSetup/category');
	}
	insertcategory(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/category', value);
	}
	updatecategory(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/category/' + value.cat_id, value);
	}
	deletecategory(value) {
		this.service.startLoading();
		return this.http.delete('/siSetup/category/' + value.cat_id);
	}
	getnationality() {
		this.service.startLoading();
		return this.http.get('/siSetup/nationality');
	}
	insertnationality(value) {
		this.service.startLoading();
		return this.http.post('/siSetup/nationality', value);
	}
	updatenationality(value: any) {
		this.service.startLoading();
		return this.http.put('/siSetup/nationality/' + value.nat_id, value);
	}
	deletenationality(value) {
		this.service.startLoading();
		return this.http.delete('/siSetup/nationality/' + value.nat_id);
	}
	logout(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/logout', value);
	}
	saveUserLastState(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/saveUserLastState', value);
	}
}
