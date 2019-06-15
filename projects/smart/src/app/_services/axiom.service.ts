import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonAPIService } from '../_services/commonAPI.service';
import { environment } from '../../../../../src/environments/environment';
import { of } from 'rxjs';
@Injectable()
export class AxiomService {

	constructor(private http: HttpClient, private service: CommonAPIService) { }
	// fetch subtopic
	getSubtopicByTopic(topic_id) {
		this.service.startLoading();
		return this.http.get(environment.apiAxiomUrl + `/setupdetail/getSubtopicByTopic/${topic_id}`);
	}
	// fetch topic
	getTopicByClassSubject(class_id, subject_id) {
		const param: any = {};
		if (class_id) {
		    param.class_id = class_id;
		}
		if (subject_id) {
			param.sub_id = subject_id;
        }
        console.log(param);
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/setupdetail/getTopicByBoardClassSubject', param);
	}
	getSubjectsByClass(value) {
		const param: any = {};
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		this.service.startLoading();
		return this.http.post(environment.apiAxiomUrl + '/setupdetail/getSubjectsByClass', param);
	}
}
