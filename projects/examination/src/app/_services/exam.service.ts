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

	insertExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertExam', value);
	}

	insertSubExam(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertSubExam', value);
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
	insertReportCardSetup(value) {
		this.service.startLoading();
		return this.http.post(environment.apiExamUrl + '/setup/insertReportCardSetup', value);
	}
}

