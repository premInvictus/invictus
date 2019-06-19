import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { LoaderService, CommonAPIService, SisService } from '../_services';
import { environment } from '../../../src/environments/environment';
@Injectable()
export class SyllabusserviceService {
			currentUser: any = {};
			constructor(
				private _http: HttpClient,
				private loaderService: LoaderService,
			) {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
			}
			getClass() {
				const param: any = {};
				param.role_id = this.currentUser.role_id;
				if (this.currentUser.role_id === '3' || this.currentUser.role_id === '1') {
					param.login_id = this.currentUser.login_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/setupdetail/getClassData', param);
			}

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
			getTermList() {
				this.loaderService.startLoading();
				return this._http.get(environment.apiSmartUrl + '/smtsyllabus/getTermList');
			}
			ctrList() {
				this.loaderService.startLoading();
				return this._http.get(environment.apiSmartUrl + '/smtsyllabus/ctrList');
			}
			insertSyllabus(value) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/insert', value);
			}
			getSyllabus(value) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/get_syllabus', value);
			}
			insertSyllabusDetails(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/insertSyllabusDetails', value);
			}
			getSylIdByClassSubject(class_id: any, sub_id: any) {
				const param: any = {};
				param.syl_class_id = class_id;
				param.syl_sub_id = sub_id;
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/getSylIdByClassSubject', param);
			}
			getSyllabusDetails(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/getSyllabusDetails', value);
			}
			deleteSyllabusDetails(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/updateSyllabusDetails', value);
			}
			updateSyllabusEditDetails(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/updateSyllabusDetails', value);
			}
			getSyllabusDetailsEdit(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/getSyllabusDetailsEdit', value);
			}
			insertPublishSyllabus(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/insertPublishSyllabus', value);
			}
			updatePublishStatus(value: any) {
				return this._http.post(environment.apiSmartUrl + '/smtsyllabus/updatePublishStatus', value);
			}
}
