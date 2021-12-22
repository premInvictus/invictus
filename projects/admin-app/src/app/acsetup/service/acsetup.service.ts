import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { LoaderService } from 'projects/axiom/src/app/_services/loader.service';
import {environment} from 'src/environments/environment';
@Injectable()

export class AcsetupService {

		constructor(
				private http: HttpClient,
				private loaderService: LoaderService,
				private commonAPIService: CommonAPIService
		) { }

		exportClass(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/exportClass', value);

		}
		exportSubject(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/exportSubject', value);

		}
		exportService(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/exportService', value);

		}
		exportTopic(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/exportTopic', value);

		}
		exportSubTopic(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/exportSubTopic', value);

		}

		addBoard(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/board', value);

		}
		addSection(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/section', value);

		}
		addSubject(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/subject', value);

		}
		addService(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/insertService', value);

		}
		getBanksAll(value) {
			this.loaderService.startLoading();
			return this.http.get(environment.apiFeeUrl + '/feeSetup/getAllBank');
		}
		getPaymentMode(value) {
			return this.http.get(environment.apiFeeUrl + '/feeSetup/getPaymentMode');
		}
		addClass(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/classes', value);

		}
		addTopic(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/topic', value);

		}
		addSubtopic(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/subtopic', value);

		}
		addQsubtype(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/question_subtype', value);

		}
		addQtype(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/question_type', value);

		}
		addSkill(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/skilltype', value);

		}
		addLod(value: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/difficulties_level', value);

		}
		getBoard() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/board/1');
		}
		getBoardALL() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/board');

		}
		getSection() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/section/1');

		}
		getSectionAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/section');

		}
		getSubject() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/subject/1');

		}
		getSubjectAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/subject');

		}
		getService(value) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/getService', value);

		}
		getClass() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/classes/1');

		}
		getClassAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/classes');

		}
		getTopic() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/topic/1');

		}
		getTopicAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/topic');

		}
		getSubtopic() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/subtopic/1');

		}
		getSubtopicAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/subtopic');

		}
		getQsubtype() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/question_subtype/1');

		}
		getQsubtypeAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/question_subtype');

		}
		getQtype() {
				console.log('calling getQtype from acsetupservice');
				this.commonAPIService.getQtype().subscribe(value => {
						return of(value);
				});
		}
		getQtypeAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/question_type');

		}
		getSkill() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/skilltype/1');

		}
		getSkillAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/skilltype');

		}
		getLod() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/difficulties_level/1');

		}
		getLodAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/difficulties_level');

		}
		getCountry() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getCountry/1');

		}
		getCountryAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getCountry');

		}
		getState() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getState/1');

		}
		getStateAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getState');

		}
		getStateCountryByCity(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiSisUrl + '/setup/getStateCountryByCity', value);
		}
		getCity() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getCity/1');

		}
		getCityAll() {
				this.loaderService.startLoading();
				return this.http.get(environment.apiAxiomUrl + '/setup/getCity');

		}
		editBoard(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/board/${value.board_id}`, value);

		}
		editSection(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/section/${value.sec_id}`, value);


		}
		editSubject(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/subject/${value.sub_id}`, value);

		}
		editService(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/setup/updateService', value);

	}
		editClass(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/classes/${value.class_id}`, value);


		}
		editTopic(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/topic/${value.topic_id}`, value);


		}
		editSubtopic(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/subtopic/${value.st_id}`, value);


		}
		editQsubtype(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/question_subtype/${value.qst_id}`, value);


		}
		editQtype(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/question_type/${value.qt_id}`, value);


		}
		editSkill(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/skilltype/${value.skill_id}`, value);

		}
		editLod(value: any) {
				this.loaderService.startLoading();
				return this.http.put(environment.apiAxiomUrl + `/setup/difficulties_level/${value.dl_id}`, value);

		}
		deleteBoard(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/board/${delval.board_id}`);

		}
		deleteSection(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/section/${delval.sec_id}`);


		}
		deleteSubject(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/subject/${delval.sub_id}`);


		}
		deleteService(delval: any) {
			delval.status = '5';
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setup/updateService', delval);


		}

		deleteClass(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/classes/${delval.class_id}`);


		}
		deleteTopic(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/topic/${delval.topic_id}`);


		}
		deleteSubtopic(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/subtopic/${delval.st_id}`);


		}
		deleteQsubtype(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/question_subtype/${delval.qst_id}`);


		}
		deleteQtype(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/question_type/${delval.qt_id}`);


		}
		deleteSkill(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/skilltype/${delval.skill_id}`);

		}
		deleteLod(delval: any) {
				this.loaderService.startLoading();
				return this.http.delete(environment.apiAxiomUrl + `/setup/difficulties_level/${delval.dl_id}`);

		}

		getSubjecstByClass(class_id: any) {
				const param: any = {};
				if (class_id) {
						param.class_id = class_id;
				}
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setupdetail/getSubjectsByClass', param);

		}
		getTopicByBoardClassSubject(board_id: any, class_id: any, sub_id: any) {
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setupdetail/getTopicByBoardClassSubject',
				{ board_id: board_id, class_id: class_id, sub_id: sub_id });

		}
		getTopicByClassSubject(value) {
				const param: any = {};
				if (value.board_id) {
						param.board_id = value.board_id;
				}
				if (value.class_id) {
						param.class_id = value.class_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				this.loaderService.startLoading();
				return this.http.post(environment.apiAxiomUrl + '/setupdetail/getTopicByBoardClassSubject', param);

		}
		insertBilling(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/insertBilling', value);

		}
		getBilling(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/getBilling', value);

		}
		changeBillingStatus(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/changeBillingStatus', value);

		}
		updateBilling(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/updateBilling', value);

		}
		printBilling(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/printBilling', value);

		}
		insertReceipt(value: any) {
			this.loaderService.startLoading();
			return this.http.post(environment.apiAxiomUrl + '/billing/insertReceipt', value);

		}
		getFeeMonths(value) {
			this.loaderService.startLoading();
			return this.http.get(environment.apiFeeUrl + '/feeSetup/getFeeMonths');
		}
}
