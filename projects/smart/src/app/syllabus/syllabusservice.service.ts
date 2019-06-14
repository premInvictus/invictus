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

}
