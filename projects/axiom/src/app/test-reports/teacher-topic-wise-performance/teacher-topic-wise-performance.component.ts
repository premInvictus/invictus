import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { HtmlToTextService } from '../../_services/htmltotext.service';

@Component({
		selector: 'app-teacher-topic-wise-performance',
		templateUrl: './teacher-topic-wise-performance.component.html',
		styleUrls: ['./teacher-topic-wise-performance.component.css']
})
export class TeacherTopicWisePerformanceComponent implements OnInit {

		testQuestionArray: any[] = [];
		testQuestionArrayResult: any[] = [];
		topicSubtopicArray: any[] = [];
		es_id: number;
		etopicArray: any[] = [];
		estArray: any[] = [];
		attendanceArray: any[] = [];
		noOfStudents: any;
		legend = false;
		tableCollection = false;
		subjectArrayOfQP: any[] = [];
		subjectWiseTopicArray: any[] = [];
		testQuestionArrayTemp: any[] = [];
		examDetail: any;
		currentQP: any;
		constructor(private reportService: ReportService,
				private route: ActivatedRoute,
				private qelementService: QelementService,
				private htt: HtmlToTextService
		) { }
		ngOnInit() {
				this.es_id = this.route.snapshot.params['id'];
				this.getTestQuestions();
				this.qelementService.getExamAttendance({
						es_id: this.es_id
				}).subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.attendanceArray = result.data;
								}
						}
				);
		}
		htmlToText(html) {
				return this.htt.htmlToText(html);
		}
		getTestQuestions(): void {
				this.testQuestionArray = [];
				this.testQuestionArrayTemp = [];
				this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.examDetail = result.data[0];
								this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id}).subscribe(
									(result1: any) => {
										if (result1 && result1.status === 'ok') {
											this.currentQP = result1.data[0];
											let subIdArray = [];
											subIdArray = this.currentQP.qp_sub_id.replace(/\s/g, '').split(',');
											let subNameArray = [];
											subNameArray = this.currentQP.sub_name.replace(/\s/g, '').split(',');
											if (subIdArray.length === subNameArray.length) {
												for (let i = 0; i < subIdArray.length; i++) {
													const subIdName = {
														sub_id: subIdArray[i],
														sub_name: subNameArray[i]
													};
													this.subjectArrayOfQP.push(subIdName);
												}
											}

											for (const item of this.subjectArrayOfQP) {
												for (const titem of this.currentQP.qlist) {
													if (Number(titem.topic_sub_id) === Number(item.sub_id)) {
													const findex = this.subjectWiseTopicArray.findIndex((f) =>
													Number(f.topic_id) === Number(titem.topic_id)
														&&
														Number(f.st_id) === Number(titem.st_id));
														if ( findex === -1) {
														this.subjectWiseTopicArray.push({
															topic_id: titem.topic_id,
															topic_name: titem.topic_name,
															st_name: titem.st_name,
															st_id: titem.st_id,
															sub_id: item.sub_id
														});
													} else {
														continue;
													}
													} else {
														continue;
													}
												}
											}
											this.reportService.testQuestionAnalysis({
												es_id: this.es_id
										}).subscribe(
												(result2: any) => {
														if (result2 && result2.status === 'ok') {
																this.testQuestionArrayResult = result2.data;
																let curTopic_id = 0;
																let curTopic_name = '';
																let st_total = 0;
																for (const item of this.testQuestionArrayResult) {
																		if (curTopic_id !== item.topic_id) {
																				curTopic_id = item.topic_id;
																				curTopic_name = item.topic_name;
																				this.etopicArray.push({
																						topic_id: curTopic_id,
																						topic_name: curTopic_name
																				});
																		}
																}
																let curst_id = 0;
																let curst_name = '';
																for (const item of this.testQuestionArrayResult) {
																		if (curst_id !== item.st_id) {
																				curst_id = item.st_id;
																				curst_name = item.st_name;
																				curTopic_id = item.topic_id;
																				this.estArray.push({
																						topic_id: curTopic_id,
																						st_id: curst_id,
																						st_name: curst_name,
																						totalCorrect: '',
																						disPriority: '',
																						qusArray: []
																				});
																		}
																}
																let jitem: any = {};
																for (const titem of this.etopicArray) {
																		jitem = {};
																		jitem.topic_name = titem.topic_name;
																		jitem.topic_id = titem.topic_id;
																		const stArray = [];
																		for (const sitem of this.estArray) {
																				if (sitem.topic_id === titem.topic_id) {
																						stArray.push(sitem);
																				}
																		}
																		jitem.stArray = stArray;
																		this.topicSubtopicArray.push(jitem);
																}
																for (const titem of this.topicSubtopicArray) {
																		let cntRowSpan = 0;
																		for (const sitem of titem.stArray) {
																				st_total = 0;
																				for (const qus of this.testQuestionArrayResult) {
																						if (qus.topic_id === titem.topic_id && qus.st_id === sitem.st_id) {
																								st_total += Number(qus.correct);
																								sitem.qusArray.push(qus);
																						}
																				}
																				sitem.row_span = sitem.qusArray.length.toString();
																				cntRowSpan += sitem.qusArray.length;
																				sitem.totalCorrect = Math.round(st_total / (sitem.qusArray.length * this.attendanceArray.length) * 100);
																				if (sitem.totalCorrect > 60) {
																						sitem.disPriority = '<i class=\'far fa-flag teacher-score-flag-green\'></i>';
																				} else if (sitem.totalCorrect > 32) {
																						sitem.disPriority = '<i class=\'far fa-flag  teacher-score-flag-yellow\'></i>';
																				} else {
																						sitem.disPriority = '<i class=\'far fa-flag  teacher-score-flag-red\'></i>';
																				}

																		}
																		titem.row_span = cntRowSpan.toString();
																		this.testQuestionArray.push(titem);
																}
																for (const item of this.subjectWiseTopicArray) {
																		for (const titem of this.testQuestionArray) {
																			for (const st of titem.stArray) {
																				if (Number(item.st_id) === Number(st.st_id)) {
																					const findex = this.testQuestionArrayTemp.findIndex(f =>
																						Number(f.topic_id) === Number(titem.topic_id));
																						if (findex === -1) {
																					this.testQuestionArrayTemp.push({
																						row_span: titem.row_span,
																						stArray: titem.stArray,
																						topic_id: titem.topic_id,
																						topic_name: titem.topic_name,
																						sub_id: item.sub_id
																					});
																				}
																				}
																			}
																		}
																	}
																this.tableCollection = true;
														}
												}
										);
										}
									});
							}
						});
				}
	printPerformance() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
			'<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
			'<style>button.submit-button { display:none; } @page {size:landscape}' +
			'.dialog-table-review {font-size: 12px;width:100%}' +
			'.table-top-border-remove[_ngcontent-c20] td[_ngcontent-c20] {border-top: none !important;}' +
			'.tStyle[_ngcontent-c20] {width: 26%;}' +
			'td[_ngcontent-c20] {padding: 8px;text-align:center !important}' +
			'.dialog-table-review-header {background-color: #e6e5df !important;}' +
			'.teacher-other-tab-table {border: 1px solid #9c3;height:500px !important}' +
			'.change_mat_progress{display: block;height: 15px;overflow: hidden;position: relative;transition: opacity 250ms linear;}' +
			'.table-top-border-remove td{border-top: none !important;}' +
			'.mat-progress-bar .mat-progress-bar-element {height: 100% ;width: 100%;position:absolute}' +
			'.mat-progress-bar-buffer {background: #E4E8EB !important;}' +
			'.mat-progress-bar-primary.mat-progress-bar-fill.mat-progress-bar-element {transform: scaleX(0.02);}' +
			'.barStyle[_ngcontent-c20] {width: 30%;}' +
			// tslint:disable-next-line:max-line-length
			'.mat-progress-bar .mat-progress-bar-fill {animation: none;transform-origin: top left;transition: transform 250ms ease;transform: scaleX(0.02);}' +
			'.mat-progress-bar-primary.mat-progress-bar-fill.mat-progress-bar-element {background-color: #258cb3 !important;}' +
			'.teacher-score-flag-green {color: #28a745 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-yellow {color: #ffc108 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-red {color: #dc3545 !important;font-size: 16px !important;}' +
			'.float-right{float:right}' +
			'tr[_ngcontent-c20], th[_ngcontent-c20], td[_ngcontent-c20] {padding: 8px;}' +
			'mat-tab-header {display: none;}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'b{font-weight: bolder;}' +
			'.info-first-circle {color: #f44a66;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-four-circle {color: #ffb519;}' +
			'.row{display:flex !important}' +
			'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
			'.col-lg-12 {width: 100%;}' +
			'.col-lg-3 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
			'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
}
