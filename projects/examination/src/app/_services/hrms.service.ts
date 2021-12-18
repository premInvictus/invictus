import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from './commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { LoaderService } from './loader.service';
import { of } from 'rxjs';
@Injectable()
export class HumanResourceService {

	constructor(private http: HttpClient, private service: CommonAPIService,
		private loader: LoaderService) { }


	getAllEmployeeDetail(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/employee/getAllEmployee', value);
	}

	insertMessage(value) {
		this.loader.startLoading();
		return this.http.post(environment.apiHRUrl + '/communication/insert', value);
	}

}
