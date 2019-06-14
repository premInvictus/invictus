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
		return this.http.post('/classwork/getSubjectByTeacherId', value);
	}
	getClassByTeacherIdSubjectId(value) {
		this.service.startLoading();
		return this.http.post('/classwork/getClassByTeacherIdSubjectId', value);
	}
	getSectionByTeacherIdSubjectIdClassId(value) {
		this.service.startLoading();
		return this.http.post('/classwork/getSectionByTeacherIdSubjectIdClassId', value);
	}
	classworkInsert(value) {
		this.service.startLoading();
		return this.http.post('/classwork/insert', value);
	}
}
