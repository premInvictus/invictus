import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonAPIService } from './commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class FeeService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }

	getRoutes(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportroutes/getTransportRoutes', value);
	}
	getTransportStudent(value) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transport/getTransportStudent', value);
	}
	getSlabs(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportslab/getTransportSlab', value);
	}
	saveStoppage(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/insertTransportStoppages', value);
	}
	getStoppage(value: any) {
		this.service.startLoading();
		return this.http.post(environment.apiFeeUrl + '/transportstoppages/getTransportStoppages', value);
	}
}
