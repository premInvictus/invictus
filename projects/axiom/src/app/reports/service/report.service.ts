import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { LoaderService, NotificationService } from '../../_services/index';
import { environment } from 'src/environments/environment';
@Injectable()

export class ReportService {
		constructor(
				private _http: HttpClient,
				private loaderService: LoaderService,
				private notificationService: NotificationService
		) { }

		viewMarkObtained(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.eva_id) {
						param.eva_id = value.eva_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/viewMarkObtained', param);
		}
		viewReportTimeTaken(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.eva_id) {
						param.eva_id = value.eva_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportTimeTaken', param);
		}
		viewRankObtained(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/viewRankObtained', param);
		}
		viewReport(value) {
				const param: any = {};
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReport', param);
		}

		viewReportTopicSubtopic(value) {
				this.loaderService.startLoading();
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportTopicSubtopic', param);
		}
		viewReportTopic(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportTopic', param);
		}
		correctQuestion(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/correctStudentwise', param);

		}

		correctQuestionwise(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}

				if (value.qp_id) {
						param.qp_id = value.qp_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/correctQuestionwise', param);

		}

		incorrectQuestion(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/incorrectStudentwise', param);

		}

		incorrectQuestionwise(value) {
				const param: any = {};

				if (value.qus_id) {
						param.qus_id = value.qus_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/incorrectQuestionwise', param);

		}

		skipQuestion(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/skipStudentwise', param);

		}
		viewReportDifficultyLevel(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportDifficultyLevel', param);
		}

		skipQuestionwise(value) {
				const param: any = {};
				if (value.qus_id) {
						param.qus_id = value.qus_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/skipQuestionwise', param);
		}

		viewReportSkillType(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportSkillType', param);
		}
		viewReportQuestionType(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/viewReportQuestionType', param);
		}

		printQuestionPaper(value) {
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.qp_id) {
						param.qp_id = value.qp_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/questionpaper/printQuestionPaper', param);
		}

		studentOveralPerformance(value) {
				this.loaderService.startLoading();
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.class_id) {
						param.class_id = value.class_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.au_admission_no) {
						param.au_admission_no = value.au_admission_no;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/studentOveralPerformance', param);
		}

		testQuestionAnalysis(value) {
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.qus_id) {
						param.qus_id = value.qus_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/testQuestionAnalysis', param)
	;
		}
		testReportOverview(value) {
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.qus_id) {
						param.qus_id = value.qus_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/testReportOverview', param);
		}
		classHighest(value) {
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/classHighest', param);
		}
		classAverage(value) {
				const param: any = {};

				if (value.es_id) {
						param.es_id = value.es_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/classAverage', param);
		}
		topicwisePerformanceGraph(value) {
				const param: any = {};
				if (value.es_id) {
						param.es_id = value.es_id;
				}
				if (value.login_id) {
						param.login_id = value.login_id;
				}
				if (value.class_id) {
						param.class_id = value.class_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				if (value.sec_id) {
						param.sec_id = value.sec_id;
				}
				this.loaderService.startLoading();
				return this._http.post(environment.apiAxiomUrl + '/report/topicwisePerformanceGraph', param);
		}

		topicwisePerformanceGraphAvgHighest() {
				return this._http.get(environment.apiAxiomUrl + '/report/topicwisePerformanceGraphAvgHighest');
		}
		classOveralPerformance(value) {
				return this._http.post(environment.apiAxiomUrl + '/report/classOveralPerformance', value);
		}

		classPerformanceTopicSubtopicwise(value) {
				const param: any = {};
				if (value.class_id) {
						param.class_id = value.class_id;
				}
				if (value.sec_id) {
						param.sec_id = value.sec_id;
				}
				if (value.sub_id) {
						param.sub_id = value.sub_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/classPerformanceTopicSubtopicwise', param);
		}
		classPerformanceTopicSubtopicwiseReport(value) {
				return this._http.post(environment.apiAxiomUrl + '/report/getClassPerformanceTopicSubtopicWise', value);
		}
		classPerformanceSubjectWise(value) {
				return this._http.post(environment.apiAxiomUrl + '/report/getClassPerformanceSubjectWise', value);
		}
		classPerformanceTopicSectionWise(value) {
				return this._http.post(environment.apiAxiomUrl + '/report/getClassPerformanceTopicSectionWise', value);
		}
		classPerformanceTopicSectionSlabWise(value) {
				return this._http.post(environment.apiAxiomUrl + '/report/getClassPerformanceTopicSectionSlabWise', value);
		}
		insertBookmark(value) {
				const param: any = {};
				if (value.login_id) {
						param.bm_login_id = value.login_id;
				}
				if (value.qus_id) {
						param.bm_qus_id = value.qus_id;
				}
				if (value.class_id) {
						param.bm_class_id = value.class_id;
				}
				if (value.sub_id) {
						param.bm_sub_id = value.sub_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/insertBookmark', param);
		}
		deleteBookmark(value) {
				return this._http.delete(environment.apiAxiomUrl + `/report/deleteBookmark/${value.bm_id}`);
		}
		getClassByTeacher(value) {
				return this._http.post(environment.apiAxiomUrl + '/users/getClassByTeacher/', value);
		}
		getBookmark(value) {
				const param: any = {};
				if (value.login_id) {
						param.bm_login_id = value.login_id;
				}
				if (value.class_id) {
						param.bm_class_id = value.class_id;
				}
				if (value.sub_id) {
						param.bm_sub_id = value.sub_id;
				}
				if (value.qus_id) {
						param.bm_qus_id = value.qus_id;
				}
				return this._http.post(environment.apiAxiomUrl + '/report/getBookmark', param);
		}
}
