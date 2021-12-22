import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderService } from './loader.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class SmartService {
	private processType;
	constructor(private http: HttpClient, private service: LoaderService) { }
	getSectionsByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSectionsByClass', value);
	}
	getSubjectsByClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getSubjectsByClass', value);
	}

	// global configuaration calls

	getClass(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getClass', value);
	}

	getSection(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getSection', value);
	}

	getSubject(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/setup/getSubject', value);
	}

	getClassData(value) {
		this.service.startLoading();
		return this.http.post(environment.apiSmartUrl + '/common/getClassData', value);
	}
}


