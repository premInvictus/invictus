import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable()
export class SisService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	insertFeeAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/feeAccount/insertFeeAccount', value);
	}
	updateFeeAccount(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/feeAccount/updateFeeAccount/' + value.accd_id, value);
	}
	getFeeAccount(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/feeAccount/getFeeAccount', value);
	}
	getEnrollmentStatus() {
		return of({
			status: 'ok', data: [
				{ enrol_id: 'active', enrol_name: 'Active' },
				{ enrol_id: 'left', enrol_name: 'Left' }
			]
		});
	}
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
		return this.http.post(environment.apiSisUrl + '/qualifications/insertQualifications', value);
	}
	updateQualifications(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/qualifications/updateQualifications/' + value.qlf_id, value);
	}
	deleteQualifications(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/qualifications/deleteQualifications/' + value.qlf_id);
	}
	getHouses() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/houses/getHouses');
	}
	insertHouses(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/houses/insertHouses', value);
	}
	updateHouses(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/houses/updateHouses/' + value.hou_id, value);
	}
	deleteHouses(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/houses/deleteHouses/' + value.hou_id);
	}
	getAnnualIncome() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/annualIncome/getAnnualIncome');
	}
	insertAnnualIncome(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/annualIncome/insertAnnualIncome', value);
	}
	updateAnnualIncome(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/annualIncome/updateAnnualIncome/' + value.ai_id, value);
	}
	deleteAnnualIncome(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/annualIncome/deleteAnnualIncome/' + value.ai_id);
	}
	getOccupationType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/occupationType/getOccupationType');
	}
	insertOccupationType(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/occupationType/insertOccupationType', value);
	}
	updateOccupationType(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/occupationType/updateOccupationType/' + value.ocpt_id, value);
	}
	deleteOccupationType(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/occupationType/deleteOccupationType/' + value.ocpt_id);
	}
	getEducationDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/educationDetails/getEducationDetails', value);
	}
	insertStudentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentDetails/insertStudentDetails', value);
	}
	addStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/addStudent', value);
	}
	insertStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentPersonalDetails/insertStudentPersonalDetails', value);
	}
	insertManagementRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/insertManagementRemarks', value);
	}
	getCustomRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/getCustomRemarks', value);
	}
	insertCustomRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/insertCustomRemarks', value);
	}
	updateCustomRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/updateCustomRemarks', value);
	}
	insertEducationDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/educationDetails/insertEducationDetails', value);
	}
	updateEducationDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/educationDetails/updateEducationDetails', value);
	}
	updateStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + `/studentPersonalDetails/updateStudentPersonalDetails/${value.upd_login_id}`, value);
	}
	getStudentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentDetails/getStudentDetails', value);
	}
	getStudentInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentInformation', value);
	}
	addStudentInformation(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/addStudentInformation', value);
	}
	getReligionDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/religionDetails/getReligionDetails', value);
	}
	insertReligionDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/religionDetails/insertReligionDetails', value);
	}
	updateReligionDetails(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/religionDetails/updateReligionDetails/' + value.rel_id, value);
	}
	deleteReligionDetails(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/religionDetails/deleteReligionDetails/' + value.rel_id);
	}
	getManagementRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/getManagementRemarks', value);
	}
	getMotherTongue(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/motherTongue/getMotherTongue', value);
	}
	insertMotherTongue(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/motherTongue/insertMotherTongue', value);
	}
	updateMotherTongue(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/motherTongue/updateMotherTongue/' + value.mt_id, value);
	}
	deleteMotherTongue(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/motherTongue/deleteMotherTongue/' + value.mt_id);
	}
	updateStudentDetails(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + `/studentDetails/updateStudentDetails/${value.au_login_id}`, value);
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
		return this.http.post(environment.apiSisUrl + '/users/getUser', param);
	}
	getSchool() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboard/getSchool');
	}
	getBranch(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getBranch', value);
	}
	getActivity() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/activity');
	}
	insertActivity(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/activity', value);
	}
	updateActivity(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/activity/' + value.act_id, value);
	}
	deleteActivity(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/activity/' + value.act_id);
	}
	getLevelOfInterest() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/levelOfInterest');
	}
	insertLevelOfInterest(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/levelOfInterest', value);
	}
	updateLevelOfInterest(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/levelOfInterest/' + value.loi_id, value);
	}
	deleteLevelOfInterest(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/levelOfInterest/' + value.loi_id);
	}
	getEventLevel() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/eventLevel');
	}
	insertEventLevel(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/eventLevel', value);
	}
	updateEventLevel(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/eventLevel/' + value.el_id, value);
	}
	deleteEventLevel(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/eventLevel/' + value.el_id);
	}
	getActivityClub() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/activityClub');
	}
	insertActivityClub(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/activityClub', value);
	}
	updateActivityClub(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/activityClub/' + value.acl_id, value);
	}
	deleteActivityClub(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/activityClub/' + value.acl_id);
	}
	getAuthority() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/authority');
	}
	insertAuthority(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/authority', value);
	}
	updateAuthority(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/authority/' + value.aut_id, value);
	}
	deleteAuthority(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/authority/' + value.aut_id);
	}
	getCountry() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/getCountry');
	}
	getNationality() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/nationality');
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
		return this.http.get(environment.apiSisUrl + '/setup/getState/');
	}
	getStateCountryByCity(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getStateCountryByCity', value);
	}
	getCity() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/getCity/1');
	}
	getReason(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/getReason', value);
	}
	insertReason(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/setup/insertReason', value);
	}
	updateReason(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/setup/updateReason/' + value.reason_id, value);
	}
	deleteReason(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/setup/deleteReason/' + value.reason_id);
	}
	getDepartment(value) {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/department');
	}
	getBloodGroup() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/bloodGroup/getBloodGroup');
	}
	insertBloodGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/bloodGroup/insertBloodGroup', value);
	}
	updateBloodGroup(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/bloodGroup/updateBloodGroup/' + value.bg_id, value);
	}
	deleteBloodGroup(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/bloodGroup/deleteBloodGroup/' + value.bg_id);
	}
	getVaccinationByDuration() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/vaccinationDuration/getVaccinationByDuration');
	}
	insertVaccinationByDuration(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/vaccinationDuration/insertVaccinationDuration', value);
	}
	updateVaccinationByDuration(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/vaccinationDuration/updateVaccinationDuration/' + value.vd_id, value);
	}
	deleteVaccinationDuration(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/vaccinationDuration/deleteVaccinationDuration/' + value.vd_id);
	}
	getVaccinations() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/vaccinations/getVaccinations');
	}
	insertVaccinations(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/vaccinations/insertVaccinations', value);
	}
	updateVaccinations(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/vaccinations/updateVaccinations/' + value.vac_id, value);
	}
	deleteVaccinations(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/vaccinations/deleteVaccinations/' + value.vac_id);
	}
	getMedications() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/medications/getMedications');
	}
	insertMedications(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/medications/insertMedications', value);
	}
	updateMedications(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/medications/updateMedications/' + value.med_id, value);
	}
	deleteMedications(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/medications/deleteMedications/' + value.med_id);
	}
	getMedicalHistory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/medicalHistory/getMedicalHistory', value);
	}
	insertMedicalHistory(value) {
		this.service.startLoading();
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/medicalHistory/insertMedicalHistory', value);
	}
	updateMedicalHistory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/medicalHistory/updateMedicalHistory', value);
	}
	getArea() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/area');
	}
	insertArea(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/area', value);
	}
	updateArea(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/area/' + value.ar_id, value);
	}
	deleteArea(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/area/' + value.ar_id);
	}
	getauthority() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/authority');
	}
	insertGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/insertGeneralRemarks', value);
	}
	updateGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/updateGeneralRemarks', value);
	}
	deleteGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/deleteGeneralRemarks', value);
	}
	getGeneralRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/getGeneralRemarks', value);
	}
	getAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/getAdmissionRemarks', value);
	}
	getParentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/parentDetails/getParentDetails', value);
	}
	insertParentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/parentDetails/insertParentDetails', value);
	}
	updateParentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/parentDetails/updateParentDetails', value);
	}
	getSkillAwards(value) {
		return this.http.post(environment.apiSisUrl + '/skillsAwards/getSkillsAwards', value);
	}
	insertSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/skillsAwards/insertSkillsAwards', value);
	}
	updateSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/skillsAwards/updateSkillsAwards', value);
	}
	updateManagementRemarks(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/remarks/updateManagementRemarks', value);
	}
	deleteSkillsAwards(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/skillsAwards/deleteSkillsAwards', value);
	}
	insertAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/insertAdmissionRemarks', value);
	}
	updateAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/updateAdmissionRemarks', value);
	}
	studentImageProfileUpload(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentDetails/studentImageProfileUpload', value);
	}
	deleteAdmissionRemarks(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/remarks/deleteAdmissionRemarks', value);
	}
	uploadDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/uploadDocuments', value);
	}
	getDocumentRequired() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/documentRequired/getDocumentRequired');
	}
	insertDocumentRequired(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documentRequired/insertDocumentRequired', value);
	}
	updateDocumentRequired(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/documentRequired/updateDocumentRequired/' + value.docreq_id, value);
	}
	deleteDocumentRequired(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/documentRequired/deleteDocumentRequired/' + value.docreq_id);
	}
	insertDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/insertDocuments', value);
	}
	getDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/getDocuments', value);
	}
	deleteDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/deleteDocuments', value);
	}
	updateDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/updateDocuments', value);
	}
	verifyDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/documents/verifyDocuments', value);
	}
	getMasterStudentDetail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudents', value);
	}
	getStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudent', value);
	}
	getCountStudents(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getCountStudents', value);
	}
	getSession() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/session');
	}
	insertSession(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/session', value);
	}
	updateSession(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/session/' + value.ses_id, value);
	}
	deleteSession(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/session/' + value.ses_id);
	}
	getStudentsPromotionTool(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getAllStudents', value);
	}
	promoteStudents(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/promote', value);
	}
	branchTransfer(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/branchTransfer', value);
	}
	getBranchClassAndSession(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/getBranchClassAndSession', value);
	}
	demoteStudents(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/demote', value);
	}
	getShuffleStudents(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getShuffleStudents', value);
	}
	getSuspendStudents(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/getSuspendStudents', value);
	}
	suspendStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/suspend', value);
	}
	revokeStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/revokeSuspend', value);
	}
	shuffle(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/shuffle', value);
	}
	getIdCardPrintSettings(value) {
		return this.http.post(environment.apiSisUrl + '/configure/getPrintSetting', value);
	}
	addIdCardPrintSettings(value) {
		return this.http.post(environment.apiSisUrl + '/configure/printSetting', value);
	}
	printApplication(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/students/printApplication', value);
	}
	changeEnrolmentNumber(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/changeEnrollmentNo', value);
	}
	changeEnrollmentStatus(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/changeEnrollmentStatus', value);
	}
	getStudentsDataPerProcessType(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/getStudentsDataPerProcessType', value);
	}
	changeEnrollBulk(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/changeEnrollBulk', value);
	}
	maxEnrollmentNo(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/maxEnrollmentNo', value);
	}
	insertEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '2';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/insertEditRequest', value);
	}
	updateEditRequest(value) {
		this.service.startLoading();
		value.pro_id = '2';
		return this.http.post(environment.apiSisUrl + '/auxiliaries/updateEditRequest', value);
	}
	getEditRequest(value) {
		value.pro_id = '2';
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/auxiliaries/getEditRequest', value);
	}
	getTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/getNotificationTemplate', value);
	}
	getRoutes(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getTransportRoutes', value);
	}
	getStoppages(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/getTransportStoppages', value);
	}
	saveTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/insertNotificationTemplate', value);
	}

	updateTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationTemplate/updateNotificationTemplate', value);
	}
	getTabBifurcation() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/configure/getTabBifurcation');
	}

	getProcessAdmission(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/admissionTool/processAdmission', value);
	}
	approveSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/approveSlcTc', value);
	}
	printAllCertificate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/printAllCertificate', value);
	}
	enableAcessCertificate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/enableAcessCertificate', value);
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
		return this.http.post(environment.apiSisUrl + '/slctc/getSlcTc', param);
	}
	insertSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/insertSlcTc', value);
	}
	issueSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/issueSlcTc', value);
	}
	cancelSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/cancelSlcTc', value);
	}
	reissueSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/reissueSlcTc', value);
	}
	insertEmailScheduler(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/insertEmailScheduler', value);
	}

	insertEmailData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/insertEmailData', value);
	}

	sendEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/sendEmail', value);
	}

	getNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/getNotificationEmail', value);
	}

	insertSMSScheduler(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/insertSMSScheduler', value);
	}

	insertSMSData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/insertSMSData', value);
	}

	sendSMS(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/sendSMS', value);
	}

	getNotificationSMS(value) {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/notificationSMS/getNotificationSMS', value);
	}
	getFormFields(value) {
		this.service.startLoading();
		value.ff_project_id = '2';
		return this.http.post(environment.apiSisUrl + '/configure/getFormFields', value);
	}
	getFormFieldsForFilter(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/configure/getFormFieldsForFilter', value);
	}

	migrgateProcessAdmission(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/admissionTool/migrateProcessAdmission', value);
	}

	uploadBulkDocuments(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/bulkUpdate/uploadBulkDocuments', value);
	}
	getStudentLastRecordPerProcessType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/studentDetails/getStudentLastRecordPerProcessType');
	}
	insertConfigureSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/configure/insertConfigureSetting', value);
	}
	getConfigureSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/configure/getConfigureSetting', value);
	}
	getStudentPersonalDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentPersonalDetails/getStudentPersonalDetails', value);
	}
	deleteStudentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentDetails/deleteStudentDetails', value);
	}
	deleteNotificationEmail(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationEmails/deleteEmailScheduler', value);
	}
	deleteNotificationSMS(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/notificationSMS/deleteSMSScheduler', value);
	}
	getSchoolInstructions() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/schoolInstructions/getSchoolInstructions/external');
	}
	insertSchoolInstructions(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/schoolInstructions/insertSchoolInstructions', value);
	}
	updateSchoolInstructions(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/schoolInstructions/updateSchoolInstructions/' + value.schi_id, value);
	}
	deleteSchoolInstructions(value: any) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/schoolInstructions/updateSchoolInstructions/', value);
	}
	generateReport(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/generateReport', value);
	}
	insertSlcTcFormConfig(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/insertSlcTcFormConfig', value);
	}
	getSlcTcFormConfig(value) {
		return this.http.post(environment.apiSisUrl + '/slctc/getSlcTcFormConfig', value);
	}
	insertSlcTcTemplateSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/insertSlcTcTemplateSetting', value);
	}
	getSlcTcTemplateSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/getSlcTcTemplateSetting', value);
	}
	insertTemplateMapping(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/insertTemplateMapping', value);
	}
	getSlcTcPrintSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/getSlcTcPrintSetting', value);
	}
	insertSlcTcPrintSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/insertSlcTcPrintSetting', value);
	}
	generateReportClassWise(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/generateReportClasswise', value);
	}
	generateReportProcessWise(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/generateReportProcessWise', value);
	}
	generateStudentStrengthSummaryReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/generateStudentStrengthSummaryReport', value);
	}
	generateStudentStrengthDetailReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/generateStudentStrengthDetailReport', value);
	}
	getStudentSiblingDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getStudentSiblingDetails', value);
	}
	getAluminiStudentDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getAluminiStudentDetails', value);
	}
	getStudentReportDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getStudentDetails', value);
	}
	getStudentDocumentReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getStudentDocumentReport', value);
	}
	getStudentBirthdayReport(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getStudentBirthdayReport', value);
	}
	printRequestSlcTc(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/slctc/printRequestSlcTc', value);
	}
	getSkillAwardsReportDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/reportSis/getSkillAwardsReportDetails', value);
	}
	getAdditionalDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getAdditionalDetails', value);
	}
	addAdditionalDetails(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/addAdditionalDetails', value);
	}
	downPdf(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/downPdf', value);
	}
	getCityNameByCityId(value) {
		return this.http.post(environment.apiSisUrl  + '/slctc/getCityNameByCityId', value);
	  }
	getStudentRemarkDataThemeTwo(value) {
		if (value) {
			this.service.startLoading();
			return this.http.post(environment.apiSisUrl + '/studentinfo/getRemarks', value);
		}
	}
	saveStudentRemarkDataThemeTwo(value) {
		if (value) {
			this.service.startLoading();
			return this.http.post(environment.apiSisUrl + '/studentinfo/addRemarks', value);
		}
	}
	getCountStudentDashboard() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboardSis/getCountStudentDashboard');
	}

	getStudentClasswiseDashboard() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboardSis/getStudentClasswiseDashboard');
	}

	getStudentBirthdayDashboard() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboardSis/getStudentBirthdayDashboard');
	}

	getNotificationsDashboard() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/dashboardSis/getNotificationsDashboard');
	}
	uploadBulkData(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/bulkUploadSis/uploadBulkData', value);
	}
	generateExcelForBulkUpload() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/bulkUploadSis/generateExcelForBulkUpload');
	}
	validateUploadBulkData(uploadedFile) {
		const fileList: FileList = uploadedFile;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('excel_file', file, file.name);
			this.service.startLoading();
			return this.http.post(environment.apiSisUrl + '/bulkUploadSis/validateUploadBulkData', formData);
		}
	}
	getcategory() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/category');
	}
	insertcategory(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/category', value);
	}
	updatecategory(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/category/' + value.cat_id, value);
	}
	deletecategory(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/category/' + value.cat_id);
	}
	getnationality() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/nationality');
	}
	insertnationality(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/nationality', value);
	}
	updatenationality(value: any) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/nationality/' + value.nat_id, value);
	}
	deletenationality(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/nationality/' + value.nat_id);
	}
	logout(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/logout', value);
	}
	validateToken(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/users/validateToken', value);
	}
	insertInvoice(value) {
		this.service.startLoading();
		value.download = true;
		return this.http.post(environment.apiFeeUrl + '/invoice/insertInvoice', value);
	}
	getStudentDataPerName(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/studentinfo/getStudentDataPerName', value);
	}
	downloadBulkUpdateTemplate(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/bulkUpdate/downloadBulkUpdateTemplate', value);
	}
	getReasonType() {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/setup/getReasonType');
	}
	reset_password(value) {
		return this.http.post('/users/reset_password', value);
	}

	getstudenttags(value) {
		this.service.startLoading();
		return this.http.get(environment.apiSisUrl + '/siSetup/studentTags');
	}

	insertstudenttags(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/siSetup/studentTags',value);
	}

	updatestudenttags(value) {
		this.service.startLoading();
		return this.http.put(environment.apiSisUrl + '/siSetup/studentTags/'+value.tag_id,value);
	}

	deletestudenttags(value) {
		this.service.startLoading();
		return this.http.delete(environment.apiSisUrl + '/siSetup/studentTags/'+value.tag_id,value);
	}
	getGlobalSettingGroup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSettingGroup', value);
	}
	getGlobalSetting(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/getGlobalSetting', value);
	}
	getAllSchoolGroups(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getAllSchoolGroups',value);
	}

	getMappedSchoolWithUser(value) {
		return this.http.post(environment.apiAxiomUrl + '/dashboard/getMappedSchoolWithUser',value);
	}
	getWallets(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/wallets/getWallets',value);
	}

	insertWallets(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/wallets/insertWallets',value);
	}
	printReceipt(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSisUrl + '/wallets/printReceipt',value);
	}
}
