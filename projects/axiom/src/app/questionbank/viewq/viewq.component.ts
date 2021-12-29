import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QbankService } from '../service/qbank.service';
import { QelementService } from '../service/qelement.service';
import {AdminService} from '../../user-type/admin/services/admin.service';
import { BreadCrumbService, HtmlToTextService, NotificationService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, Sort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// tslint:disable-next-line:max-line-length
import { SubjectiveElement, MCQElement, MatchElement, TrueFalseElement, MultiMCQElement, MatrixMatchElement, ReviewElement, MatrixMatch4X5Element, SingleIntegerElement, DoubleIntegerElement} from './qsubtypeelement.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EssayDialogsComponent } from '../essay-dialogs/essay-dialogs.component';

@Component({
		selector: 'app-viewq',
		templateUrl: './viewq.component.html',
		styleUrls: ['./viewq.component.css']
})

export class ViewqComponent implements OnInit, AfterViewInit, AfterViewChecked {
		modalRef2: BsModalRef;
		modalForm: FormGroup;
		public parameterform: FormGroup;
		public essayFlag = false;
		public questionlistFlag = false;
		public essayArray = [];
		public questionsArray: any[] = [];
		public questionTypeArray: any[];
		public questionSubtypeArray: any[];
		public subjectArray: any[];
		public classArray: any[];
		public topicArray: any[];
		public subtopicArray: any[];
		reasonsArray: any[] = [];
		ReasonArray = ['This is a duplicate question', 'This question is out of course', 'Reason 1', 'Reason 2', 'Reason 3'];
		public listtemp: number;
		public optionHA = ['A', 'B', 'C', 'D', 'E'];
		public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
		public optionmatch4X5HA = ['P', 'Q', 'R', 'S', 'T'];
		homeUrl: string;
		public qus_unpublish_remark: any;
		public currentUnpublishedQues: any = {};
		reason_id: any = {};
		tableCollectionSub: Boolean = false;
		tableCollectionMCQ: Boolean = false;
		tableCollectionMULTIMCQ: Boolean = false;
		tableCollectionTF: Boolean = false;
		tableCollectionMatch: Boolean = false;
		tableCollectionMatrix: Boolean = false;
		tableCollectionMatrix45: Boolean = false;
		tableCollectionSingleInteger: Boolean = false;
		tableCollectionDoubleInteger: Boolean = false;
		tableCollection = false;
		answerReview = '';
		enableOptionAnswer = false;
		enableOptionMtfAnswer = false;
		sortedData: any;
		essayDialogRef: MatDialogRef<EssayDialogsComponent>;
		@ViewChild(MatPaginator) paginator: MatPaginator;
		@ViewChild(MatSort) sort: MatSort;
		@ViewChild('deleteModalRef') deleteModalRef;
		SUBJECTIVE_ELEMENT_DATA: SubjectiveElement[] = [];
		MCQ_ELEMENT_DATA: MCQElement[] = [];
		MULTI_MCQ_ELEMENT_DATA: MultiMCQElement[] = [];
		TF_ELEMENT_DATA: TrueFalseElement[] = [];
		MATCH_ELEMENT_DATA: MatchElement[] = [];
		MATRIX_MATCH_ELEMENT_DATA: MatrixMatchElement[] = [];
		MATRIX_MATCH_4X5_ELEMENT_DATA: MatrixMatch4X5Element[] = [];
		REVIEW_ELEMENT_DATA: ReviewElement[] = [];
		// tslint:disable-next-line:max-line-length
		subjectivedisplayedColumns = ['positionSub', 'questionSub', 'answerSub', 'classSub', 'topicSub', 'subtopicSub', 'detailsSub', 'actionSub']; // Subjective
		mcqdisplayedColumns = ['position', 'question', 'options', 'explanations', 'class', 'topic', 'subtopic', 'details', 'action']; // MCQ
		// tslint:disable-next-line:max-line-length
		multimcqdisplayedColumns = ['positionMulti', 'questionMulti', 'optionsMulti', 'explanationsMulti', 'classMulti', 'topicMulti', 'subtopicMulti', 'detailsMulti', 'actionMulti']; // MULTIMCQ
		// tslint:disable-next-line:max-line-length
		tfdisplayedColumns = ['positionTF', 'questionTF', 'optionsTF', 'explanationsTF', 'classTF', 'topicTF', 'subtopicTF', 'detailsTF', 'actionTF']; // TRUE FALSE
		// tslint:disable-next-line:max-line-length
		matchdisplayedColumns = ['positionMatch', 'questionMatch', 'optionsMatch', 'explanationsMatch', 'classMatch', 'topicMatch', 'subtopicMatch', 'detailsMatch', 'actionMatch']; // MATCH THE FOLLOWING
		// tslint:disable-next-line:max-line-length
		matrixmatchdisplayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'detailsMatrixMatch', 'actionMatrixMatch']; // Matrix Match
		// tslint:disable-next-line:max-line-length
		matrixmatch45displayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'detailsMatrixMatch', 'actionMatrixMatch']; // Matrix Match 4 X 5
		reviewdisplayedColumns = ['position', 'question', 'answer', 'explanations', 'class', 'topic', 'subtopic', 'details', 'action'];
		subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
		mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
		multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
		tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
		matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
		matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
		matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);
		reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		tableCollectionEssay = false;
		currentUser: any;
		SINGLEINTEGER_ELEMENT_DATA: SingleIntegerElement[] = [];
	singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
	singleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'action', ];

	DOUBLEINTEGER_ELEMENT_DATA: DoubleIntegerElement[] = [];
	doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
	doubleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'action', ];

		ngAfterViewInit() {
				this.subjectivedataSource.paginator = this.paginator;
				this.subjectivedataSource.sort = this.sort;
				this.mcqdataSource.paginator = this.paginator;
				this.mcqdataSource.sort = this.sort;
				this.multimcqdataSource.paginator = this.paginator;
				this.multimcqdataSource.sort = this.sort;
				this.tfdataSource.paginator = this.paginator;
				this.tfdataSource.sort = this.sort;
				this.matchdataSource.paginator = this.paginator;
				this.matchdataSource.sort = this.sort;
				this.matrixmatchdataSource.paginator = this.paginator;
				this.matrixmatchdataSource.sort = this.sort;
				this.matrixmatch45dataSource.paginator = this.paginator;
				this.matrixmatch45dataSource.sort = this.sort;
				this.reviewdatasource.paginator = this.paginator;
				this.reviewdatasource.sort = this.sort;
				this.singleintegerdataSource.paginator = this.paginator;
				this.singleintegerdataSource.sort = this.sort;
				this.doubleintegerdataSource.paginator = this.paginator;
				this.doubleintegerdataSource.sort = this.sort;
		}
		applyFilterSubjective(filterValue: string) {
				this.subjectivedataSource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterEssay(filterValue: string) {
				this.reviewdatasource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterMCQ(filterValue: string) {
				this.mcqdataSource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterMultiMCQ(filterValue: string) {
				this.multimcqdataSource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterTF(filterValue: string) {
				this.tfdataSource.filter = filterValue.trim().toLowerCase();
		}    applyFilterMatch(filterValue: string) {
				this.matchdataSource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterMatrixMatch(filterValue: string) {
				this.matrixmatchdataSource.filter = filterValue.trim().toLowerCase();
		}
		applyFilterMatrixMatch45(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.matrixmatch45dataSource.filter = filterValue;
		}
		applyFilterSingleInteger(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.singleintegerdataSource.filter = filterValue;
		}
		applyFilterDoubleInteger(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.singleintegerdataSource.filter = filterValue;
		}

		constructor(
				private modalService: BsModalService,
				private fbuild: FormBuilder,
				private qbankService: QbankService,
				private adminService: AdminService,
				private qelementService: QelementService,
				private htt: HtmlToTextService,
				private notif: NotificationService,
				private commonAPIService: CommonAPIService,
				private route: ActivatedRoute,
				private breadCrumbService: BreadCrumbService,
				private dialog: MatDialog,
				private sanitizer: DomSanitizer
		) { }

		ngOnInit() {
				this.homeUrl = this.breadCrumbService.getUrl();
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				this.buildForm();
				this.getClass();
				this.getPublishUnpublishReasons();
		}

		buildForm() {
				this.parameterform = this.fbuild.group({
						qt_id: '',
						qst_id: '',
						class_id: '',
						sub_id: '',
						topic_id: '',
						st_id: '',
						ess_id: '',
						from_date: '',
						to_date: ''
				});
				this.modalForm = this.fbuild.group({
						qus_unpublish_remark: ['', Validators.required],
						reason_id: ['', Validators.required],
				});
		}
		ngAfterViewChecked() {
				for (const item of this.REVIEW_ELEMENT_DATA) {
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
				}
			}
			sortDataEssay(sort: Sort) {
				const data = this.REVIEW_ELEMENT_DATA.slice();
				if (!sort.active || sort.direction === '') {
					this.sortedData = data;
					this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.sortedData);
					return;
				} else {
				this.sortedData = data.sort((a, b) => {
					const isAsc = sort.direction;
					switch (sort.active) {
						case 'position':
						return compare(a.position, b.position, isAsc);
						case 'question':
						return compare(a.question, b.question, isAsc);
						case 'answer':
							return compare(a.answer, b.answer, isAsc);
						default: return 0;
					}
				});
				this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.sortedData);
			}
			function compare(a, b, isAsc) {
				return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
			}

			}
		getQuestionTypeData() {
				this.questionsArray = [];
				this.commonAPIService.getQtype()
						.subscribe(
								(result: any) => {
										if (result) {
												this.questionTypeArray = result;
										}
								}
						);
		}

		getQuestionSubtypeDataByQuestiontype() {
				if (this.parameterform.value.qt_id === '3') {
						this.essayFlag = true;
						this.parameterform.patchValue({
								'qst_id': '',
								'class_id': '',
								'sub_id': '',
								'topic_id': '',
								'st_id': '',
								'ess_id': ''
						});
				} else {
				this.essayFlag = false;
				this.parameterform.patchValue({
						'qst_id': '',
						'class_id': '',
						'sub_id': '',
						'topic_id': '',
						'st_id': '',
						'ess_id': ''
				});
				this.commonAPIService.getQsubtype(this.parameterform.value.qt_id)
						.subscribe(
								(result: any) => {
										if (result) {
												this.questionSubtypeArray = result;
										}
								}
						);
				}
		}
		getPublishUnpublishReasons() {
				this.qelementService.publishUnpublishReason({reason_type: 1}).subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.reasonsArray = result.data;
						}
				});
		}
		getCurrentUnpublishedQues(value) {
				this.currentUnpublishedQues = value;
		}

		getClass() {
				this.qelementService.getClass()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.classArray = result.data;
												this.getQuestionTypeData();
										}
								}
						);
		}

		getSubjectsByClass(): void {
				if (this.currentUser.role_id === '1') {
						// tslint:disable-next-line:max-line-length
						this.adminService.getUserAccessSubject({login_id: this.currentUser.login_id, class_id: this.parameterform.value.class_id}).subscribe((result: any) => {
								if (result && result.status === 'ok') {
									this.subjectArray = result.data;
								} else {
									this.subjectArray = [];
									this.notif.showSuccessErrorMessage('No Record Found', 'error');
								}
							});
				} else {
				this.qelementService.getSubjectsByClass(this.parameterform.value.class_id)
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.subjectArray = result.data;
										} else {
												this.subjectArray = [];
												this.notif.showSuccessErrorMessage('No Record Found', 'error');
										}
								}
						);
				}
				this.parameterform.patchValue({
						'topic_id' : '',
						'st_id' : '',
						'sub_id' : ''
				});
				}

			getTopicByClassSubject(): void {
				if (this.currentUser.role_id === '1') {
						// tslint:disable-next-line:max-line-length
						this.adminService.getUserAccessTopic({login_id: this.currentUser.login_id, class_id: this.parameterform.value.class_id, sub_id: this.parameterform.value.sub_id}).subscribe((result: any) => {
							if (result && result.status === 'ok') {
								this.topicArray = result.data;
							} else {
								this.topicArray = [];
							}
						});
					} else {
					this.qelementService.getTopicByClassSubject(this.parameterform.value.class_id, this.parameterform.value.sub_id)
							.subscribe(
									(result: any) => {
											if (result && result.status === 'ok') {
													this.topicArray = result.data;
											} else {
													this.subjectArray = [];
											}
									}
							);
						}
						this.parameterform.patchValue({
								'topic_id' : '',
								'st_id' : ''
						});
			}
		getEssay() {
				const param: any = {};
				if (this.parameterform.value.class_id) {
						param.ess_class_id = this.parameterform.value.class_id;
				}
				if (this.parameterform.value.sub_id) {
						param.ess_sub_id = this.parameterform.value.sub_id;
				}
				if (this.parameterform.value.topic_id) {
						param.ess_topic_id = this.parameterform.value.topic_id;
				}
				if (this.parameterform.value.st_id) {
						param.ess_st_id = this.parameterform.value.st_id;
				}
				param.ess_status = '1';
				this.qelementService.getEssay(param)
				.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.essayArray = result.data;
								} else {
										this.essayArray = [];
								}
						}
				);
		}

		getSubtopicByTopic(): void {
				this.qelementService.getSubtopicByTopic(this.parameterform.value.topic_id)
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.subtopicArray = result.data;
										} else {
												this.subtopicArray = [];
										}
								}
						);
		}

		getQuestionsReview() {
				//  Logic for form validation
				this.questionsArray = [];
				if (!this.parameterform.value.qt_id) {
						this.notif.showSuccessErrorMessage('Question type is required', 'error');
				}
				let param: any = {};
				param = this.parameterform.value;
				param.status = 1;
				if (this.essayFlag) {
						if (this.parameterform.value.ess_id) {
						this.questionsArray = [];
						this.REVIEW_ELEMENT_DATA = [];
						this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
						this.qelementService.getQuestionsInTemplate(param)
								.subscribe(
										(result: any) => {
												if (result && result.status === 'ok') {
														this.questionsArray = result.data;
														const optionsArray: any[] = [];
												const hoverArray: any[] = [];

												for (let i = 0; i < this.questionsArray.length; i++) {
												optionsArray[i] = '';
												hoverArray[i] = '';
												}
												let outerId = 0;
												let ind = 1;
												let t: any;

												for (t of this.questionsArray) {
												let id = 0;
												const showHover = '';
												if (t.options) {
												for (const option of t.options) {
														if (Number(t.qus_qst_id) === 1 ||
														Number(t.qus_qst_id) === 2 ||
														Number(t.qus_qst_id) === 3) {
														hoverArray[outerId] = (hoverArray[outerId] + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
														if (option.qopt_answer === '1') {
																optionsArray[outerId] = optionsArray[outerId] + '<b>' + option.qopt_options + '</b>';
														}
														} else if (Number(t.qus_qst_id) === 4) {
														hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
																t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
																t.options[id].qopt_options_match) + '\n';
																optionsArray[outerId] = optionsArray[outerId] + '<b>' + t.options[id].qopt_answer + '<b>' + '<br>';
														} else if (Number(t.qus_qst_id) === 5) {
																hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
																		t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
																		t.options_match[id].qopt_options_match) + '\n';
																		const eachanswer = t.answer[id];
																		let ansstring = '';
																		for (let ansi = 0; ansi < eachanswer.length; ansi++) {
																				if (eachanswer[ansi].qopt_answer === '1') {
																						ansstring = ansstring + this.optionmatchHA[ansi] + ' ';
																				}
																		}
																		optionsArray[outerId] = optionsArray[outerId] + '<b>' + ansstring + '<b>' + '<br>';
																} else if (Number(t.qus_qst_id) === 13) {
																hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
																		t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
																		t.options_match[id].qopt_options_match) + '\n';
																		const eachanswer = t.answer[id];
																		let ansstring = '';
																		for (let ansi = 0; ansi < eachanswer.length; ansi++) {
																				if (eachanswer[ansi].qopt_answer === '1') {
																						ansstring = ansstring + this.optionmatchHA[ansi] + ' ';
																				}
																		}
																		optionsArray[outerId] = optionsArray[outerId] + '<b>' + ansstring + '<b>' + '<br>';
																}

														// End

														id++;
														if (id === 4 && Number(t.qus_qst_id) === 13) {
																hoverArray[outerId] = hoverArray[outerId] + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
																t.options_match[id].qopt_options_match;
														}
												}
												} else {
												if (Number(t.qus_qst_id) > 5 && Number(t.qus_qst_id) < 13) {
														optionsArray[outerId] = t.qopt_answer;
												}
												if ( Number(t.qus_qst_id) === 14) {
														// tslint:disable-next-line:max-line-length
														optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
														+ t.qopt_answer + '</button>';
												}
												if ( Number(t.qus_qst_id) === 15) {
														// tslint:disable-next-line:max-line-length
														optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
														+ t.qopt_answer.charAt(0) + '</button>' +
														// tslint:disable-next-line:max-line-length
														'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
														+ t.qopt_answer.charAt(1) + '</button>';
												}
												id++;
												}

												let Details = '';
												// tslint:disable-next-line:max-line-length
												Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
													+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
													/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
													+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
													+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
													+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
													+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';

												outerId++;
												this.REVIEW_ELEMENT_DATA.push({
														position: ind,
														question: t.qus_name,
														answer: optionsArray[ind - 1],
														class: t.class_name,
														topic: t.topic_name,
														subtopic: t.st_name,
														explanations: t.qus_explanation,
														details: Details,
														showHover: hoverArray[ind - 1],
														toolid: 'tool' + ind,
														action: t
												});
												ind++;
																this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
																setTimeout(() => this.reviewdatasource.paginator = this.paginator);
														}
														this.questionlistFlag = true;
														setTimeout(() => this.getHover(), 2000);
												} else {
														this.questionlistFlag = false;
														this.notif.showSuccessErrorMessage('No Records Found', 'error');
												}
										});
								} else {
										this.notif.showSuccessErrorMessage('Please select Essay', 'error');
								}
				} else if ( this.parameterform.value.qst_id) {
						this.questionsArray = [];
						this.SUBJECTIVE_ELEMENT_DATA = [];
						this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
						this.qelementService.getQuestionsInTemplate(param)
								.subscribe(
										(result: any) => {
												if (result && result.status === 'ok') {
														this.questionsArray = result.data;
														if (Number(this.listtemp) === 6
														|| Number(this.listtemp) === 7
														|| Number(this.listtemp) === 8
														|| Number(this.listtemp) === 9
														|| Number(this.listtemp) === 10
														|| Number(this.listtemp) === 11
														|| Number(this.listtemp) === 12) {
																this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
																let ind = 1;
																let t: any;
																for (t of this.questionsArray) {
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span>Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		Details = Details + '<span >Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.SUBJECTIVE_ELEMENT_DATA.push({
																				positionSub: ind,
																				questionSub: t.qus_name,
																				answerSub: t.qopt_answer,
																				classSub: t.class_name,
																				topicSub: t.topic_name,
																				subtopicSub: t.st_name,
																				infoSub: infoDetails,
																				detailsSub: Details,
																				actionSub: t
																		});
																		ind++;
																		this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
																		this.subjectivedataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.subjectivedataSource.sort = this.sort;
																}
														}
														// ----------------MCQ CODE
														if (Number(this.listtemp) === 1) {
																this.MCQ_ELEMENT_DATA = [];
																this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
																const optionsArray: any[] = [];
																for (let i = 0; i < this.questionsArray.length; i++) {
																		optionsArray[i] = '';
																}
																let secondId = 0;
																let ind2 = 1;
																let t: any;
																for (t of this.questionsArray) {
																		let id = 0;
																		for (const option of t.options) {
																				if (option.qopt_answer !== '1') {
																						// tslint:disable-next-line:max-line-length
																						optionsArray[secondId] = optionsArray[secondId] + '<tr class="option-marking-table"><th class="tdTone1">' + this.optionHA[id] + '</th>' + '<td class="tdTone2">' + option.qopt_options + '</td></tr>';
																				} else {
																						// tslint:disable-next-line:max-line-length
																						optionsArray[secondId] = optionsArray[secondId] + '<tr class="tone text-white correct-mcq-option"><th class="tdTone1"><b>' + this.optionHA[id] + '</b></th>' + '<td class="tdTone2"><b>' + option.qopt_options + '</b></td></tr>';
																				}
																				id++;
																		}
																		secondId++;
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.MCQ_ELEMENT_DATA.push({
																				position: ind2,
																				question: t.qus_name,
																				// tslint:disable-next-line:max-line-length
																				options: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray[ind2 - 1] + '</tbody></table>',
																				explanations: t.qus_explanation,
																				class: t.class_name,
																				topic: t.topic_name,
																				subtopic: t.st_name,
																				details: Details,
																				action: t
																		});
																		ind2++;
																		this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
																		this.mcqdataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.mcqdataSource.sort = this.sort;
																}
														}
														// -------------MULTI MCQ CODE
														if (Number(this.listtemp) === 2) {
																this.MULTI_MCQ_ELEMENT_DATA = [];
																this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
																let thirdId = 0;
																let t: any;
																let ind3 = 1;
																const optionsArray2: any[] = [];
																for (let i = 0; i < this.questionsArray.length; i++) {
																		optionsArray2[i] = '';
																}
																for (t of this.questionsArray) {
																		let id2 = 0;
																		for (const option of t.options) {

																						if (option.qopt_answer !== '1') {
																								// tslint:disable-next-line:max-line-length
																								optionsArray2[thirdId] = optionsArray2[thirdId] + '<tr class="option-marking-table"><th>' + this.optionHA[id2] + '</th>' + '<td class="tdTone2">' + option.qopt_options + '</td></tr>';
																						} else {
																								// tslint:disable-next-line:max-line-length
																								optionsArray2[thirdId] = optionsArray2[thirdId] + '<tr class="tone text-white correct-multi-option bg-primary"><th><b>' + this.optionHA[id2] + '</b></th>' + '<td class="tdTone2"><b>' + option.qopt_options + '</b></td></tr>';
																						}
																						id2++;

																		}
																		thirdId++;
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.MULTI_MCQ_ELEMENT_DATA.push({
																				positionMulti: ind3,
																				questionMulti: t.qus_name,
																				// tslint:disable-next-line:max-line-length
																				optionsMulti: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray2[ind3 - 1] + '</tbody></table>',
																				explanationsMulti: t.qus_explanation,
																				classMulti: t.class_name,
																				topicMulti: t.topic_name,
																				subtopicMulti: t.st_name,
																				infoMulti: infoDetails,
																				detailsMulti: Details,
																				actionMulti: t
																		});
																		ind3++;
																		this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
																		this.multimcqdataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.multimcqdataSource.sort = this.sort;
																}
														}
														// -----------------TRUE/FALSE
														if (Number(this.listtemp) === 3) {
																this.TF_ELEMENT_DATA = [];
																this.tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
																let fourthId = 0;
																let t: any;
																let ind4 = 1;
																const optionsArray3: any[] = [];
																for (let i = 0; i < this.questionsArray.length; i++) {
																		optionsArray3[i] = '';
																}
																for (t of this.questionsArray) {
																		let id3 = 0;

																		for (const option of t.options) {
																				while (id3 < 2) {
																						if (t.options[id3].qopt_answer !== '1') {
																								// tslint:disable-next-line:max-line-length
																								optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr class="option-marking-table"><th scope="row" class="tdTone1">' + this.optionHA[id3] + '</th>' + '<td scope="row" class="tdTone2">' + t.options[id3].qopt_options + '</td></tr>';
																						} else {
																								// tslint:disable-next-line:max-line-length
																								optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr class="tone text-white correct-tf-option"><th class="tdTone1"><b>' + this.optionHA[id3] + '</b></th>' + '<td class="tdTone2"><b>' + t.options[id3].qopt_options + '</b></td></tr>';
																						}
																						id3++;
																				}
																		}
																		fourthId++;
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span class>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.TF_ELEMENT_DATA.push({
																				positionTF: ind4,
																				questionTF: t.qus_name,
																				// tslint:disable-next-line:max-line-length
																				optionsTF: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray3[ind4 - 1] + '</tbody></table>',
																				explanationsTF: t.qus_explanation,
																				classTF: t.class_name,
																				topicTF: t.topic_name,
																				subtopicTF: t.st_name,
																				infoTF: infoDetails,
																				detailsTF: Details,
																				actionTF: t
																		});
																		ind4++;
																		this.tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
																		this.tfdataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.tfdataSource.sort = this.sort;
																}
														}
														// .............Match the Folllowing
														if (Number(this.listtemp) === 4) {
																this.MATCH_ELEMENT_DATA = [];
																this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
																const optionsArray4: any[] = [];
																for (let i = 0; i < this.questionsArray.length; i++) {
																		optionsArray4[i] = '';
																}
																let fifthId = 0;
																let ind5 = 1;
																let t: any;
																for (t of this.questionsArray) {
																		let id4 = 0;

																		for (const option of t.options) {
																				while (id4 < 4) {
																						// tslint:disable-next-line:max-line-length
																						optionsArray4[fifthId] = optionsArray4[fifthId] + '<tr class="mtf-table-row table-dialog-review-row"><th>' + this.optionHA[id4] + '</th>' + '<td class="mtf-td">' + t.options[id4].qopt_options + '</td><th class="changeTh">' + this.optionmatchHA[id4] + '</b></th><td class="mtf-td">' + t.options[id4].qopt_options_match + '</td><th>' + this.optionHA[id4] + '</th><th>' + t.options[id4].qopt_answer + '</th></tr>';
																						id4++;
																				}
																		}
																		fifthId++;
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.MATCH_ELEMENT_DATA.push({
																				positionMatch: ind5,
																				questionMatch: t.qus_name,
																				// tslint:disable-next-line:max-line-length
																				optionsMatch: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray4[ind5 - 1] + '</tbody></table>',
																				explanationsMatch: t.qus_explanation,
																				classMatch: t.class_name,
																				topicMatch: t.topic_name,
																				subtopicMatch: t.st_name,
																				infoMatch: infoDetails,
																				detailsMatch: Details,
																				actionMatch: t
																		});
																		ind5++;
																		this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
																		this.matchdataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.matchdataSource.sort = this.sort;
																}
														}
														// ............Matrix match
														if (Number(this.listtemp) === 5) {
																this.MATRIX_MATCH_ELEMENT_DATA = [];
																this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
																const optionsArray6: any[] = [];
																const matchArray: any[] = [];
																const answerArray: any[] = [];
																const answerArray2: any[] = [];
																const answerArray3: any[] = [];
																for (let i = 0; i < this.questionsArray.length; i++) {
																		optionsArray6[i] = '';
																		matchArray[i] = '';
																		answerArray[i] = '';
																}
																let ninthId = 0;
																let ind6 = 1;
																let t: any;
																for (t of this.questionsArray) {
																		let id9 = 0;
																		let id13 = 0;
																		let tenthId = 0;
																		for (const answerrow of t.answer) {
																				id13 = 0;
																				let answerText = '';
																				for (const answer of answerrow) {
																						if (answer.qopt_answer === '1') {
																								answerArray3[tenthId] = answerText + this.optionmatchHA[id13] + ',';
																								answerText = answerText + this.optionmatchHA[id13] + ',';
																						} else {
																								answerArray3[tenthId] = answerText + '';
																						}
																						id13++;
																				}
																				tenthId++;
																		}
																		while ( id9 < 4 ) {
																				// tslint:disable-next-line:max-line-length
																				answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + this.optionHA[id9] + '</td><td class="changeTd">' +  t.options[id9].qopt_options + '</td><td class="changeTd">' + this.optionmatchHA[id9] + '</td><td class="changeTd">' +  t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + this.optionHA[id9] + '</td><th class="changeTh">' + answerArray3[id9] + '</th></tr>';
																				id9++;
																				}
																				ninthId++;
																				let infoDetails = '';
																				// tslint:disable-next-line:max-line-length
																				infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																		let Details = '';
																		// tslint:disable-next-line:max-line-length
																		Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																		+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																		/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																		+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																		+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																		+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																		+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																		this.MATRIX_MATCH_ELEMENT_DATA.push({
																				positionMatrixMatch: ind6,
																				questionMatrixMatch: t.qus_name,
																				infoMatrixMatch: infoDetails,
																				// tslint:disable-next-line:max-line-length
																				answerMatrixMatch: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + answerArray[ind6 - 1] + '</tbody></table>',
																				explanationsMatrixMatch: t.qus_explanation,
																				classMatrixMatch: t.class_name,
																				topicMatrixMatch: t.topic_name,
																				subtopicMatrixMatch: t.st_name,
																				detailsMatrixMatch: Details,
																				actionMatrixMatch: t
																		});
																		ind6++;
																		this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
																		this.matrixmatchdataSource.paginator = this.paginator;
																		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																		this.matrixmatchdataSource.sort = this.sort;
																}
														}
															// Matrix Match 4*5 start
												if (Number(this.listtemp) === 13) {
														this.MATRIX_MATCH_4X5_ELEMENT_DATA = [];
														this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);
														const optionsArray6: any[] = [];
														const matchArray: any[] = [];
														const answerArray: any[] = [];
														const answerArray2: any[] = [];
														const answerArray3: any[] = [];
														for (let i = 0; i < this.questionsArray.length; i++) {
																optionsArray6[i] = '';
																matchArray[i] = '';
																answerArray[i] = '';
														}
														let ninthId = 0;
														let ind6 = 1;
														let t: any;
														for (t of this.questionsArray) {
																let id9 = 0;
																const id10 = 1;
																let id13 = 0;
																let tenthId = 0;
																for (const answerrow of t.answer) {
																		id13 = 0;
																		let answerText = '';
																		for (const answer of answerrow) {
																				if (answer.qopt_answer === '1') {
																						answerArray3[tenthId] = answerText + this.optionmatch4X5HA[id13] + ',';
																						answerText = answerText + this.optionmatch4X5HA[id13] + ',';
																				} else {
																						answerArray3[tenthId] = answerText + '';
																				}
																				id13++;
																		}
																		tenthId++;
																}
																while ( id9 < 4 ) {
																		// tslint:disable-next-line:max-line-length
																		answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + this.optionHA[id9] + '</td><td class="changeTd">' +  t.options[id9].qopt_options + '</td><td class="changeTd">' + this.optionmatch4X5HA[id9] + '</td><td class="changeTd">' +  t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + this.optionHA[id9] + '</td><th class="changeTh">' + answerArray3[id9] + '</th></tr>';
																		id9++;
																		}
																		if (id9 === 4) {
																				// tslint:disable-next-line:max-line-length
																				answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + '-' + '</td><td class="changeTd">' + '-' + '</td><td class="changeTd">' + this.optionmatch4X5HA[id9] + '</td><td class="changeTd">' +  t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + '-' + '</td><th class="changeTh">' + '-' + '</th></tr>';
																		}
																		ninthId++;
																		let infoDetails = '';
																		// tslint:disable-next-line:max-line-length
																		infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
																let Details = '';
																// tslint:disable-next-line:max-line-length
																Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
																	+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
																	/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
																	+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
																	+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
																	+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
																	+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
																	let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																// tslint:disable-next-line:max-line-length
																reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
																	+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
																+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>'; } else {
																		reasons = 'Not Applicable';
																		}
																this.MATRIX_MATCH_4X5_ELEMENT_DATA.push({
																		positionMatrixMatch: ind6,
																		questionMatrixMatch: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		answerMatrixMatch: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + answerArray[ind6 - 1] + '</tbody></table>',
																		explanationsMatrixMatch: t.qus_explanation,
																		classMatrixMatch: t.class_name,
																		topicMatrixMatch: t.topic_name,
																		subtopicMatrixMatch: t.st_name,
																		detailsMatrixMatch: Details,
																		reasons: reasons,
																		actionMatrixMatch: t
																});
																ind6++;
																this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);
																this.matrixmatch45dataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.matrixmatch45dataSource.sort = this.sort;
														}
												}
													// Single Integer
													if (Number(this.listtemp) === 14) {
														this.SINGLEINTEGER_ELEMENT_DATA = [];
														this.singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
														let ind = 1;
														let t: any;

														for (t of this.questionsArray) {

															let infoDetails = '';
															// tslint:disable-next-line:quotemark
															infoDetails = infoDetails + "<span class='badge badge-secondary'>Class:"
																// tslint:disable-next-line:quotemark
																+ t.class_name + "</span><br>" + "<span class='badge badge-secondary'>Subject:"
																// tslint:disable-next-line:quotemark
																+ t.sub_name + "</span><br>" + "<span class='badge badge-secondary'> Topic:"
																	// tslint:disable-next-line:quotemark
																+ t.topic_name + "</span><br>" + "<span class='badge badge-secondary'>Sub-Topic:"
																	// tslint:disable-next-line:quotemark
																+ t.st_name + "</span>";

															let Details = '';
															Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
															+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
															/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
															+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
															+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
															+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
															+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';

															let reasons = '';
															if (t.qus_unpublish_reason_desc) {
															reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
															+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
															+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
															} else {
																reasons = 'Not Applicable';
															}
															this.SINGLEINTEGER_ELEMENT_DATA.push({
																position: ind,
																question: t.qus_name,
																answer: t.qopt_answer,
																class: t.class_name,
																topic: t.topic_name,
																subtopic: t.st_name,
																info: infoDetails,
																details: Details,
																reasons: reasons,
																action: t
															});
															ind++;
															this.singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
															this.singleintegerdataSource.paginator = this.paginator;
															this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
															this.singleintegerdataSource.sort = this.sort;
														}
												}
												// End

												// Double Integer

													// Single Integer
													if (Number(this.listtemp) === 15) {
														this.DOUBLEINTEGER_ELEMENT_DATA = [];
														this.doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
														let ind = 1;
														let t: any;

														for (t of this.questionsArray) {

															let infoDetails = '';
															// tslint:disable-next-line:quotemark
															infoDetails = infoDetails + "<span class='badge badge-secondary'>Class:"
																// tslint:disable-next-line:quotemark
																+ t.class_name + "</span><br>" + "<span class='badge badge-secondary'>Subject:"
																// tslint:disable-next-line:quotemark
																+ t.sub_name + "</span><br>" + "<span class='badge badge-secondary'> Topic:"
																	// tslint:disable-next-line:quotemark
																+ t.topic_name + "</span><br>" + "<span class='badge badge-secondary'>Sub-Topic:"
																	// tslint:disable-next-line:quotemark
																+ t.st_name + "</span>";

															let Details = '';
															Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
															+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
															/* +'<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>' */
															+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
															+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
															+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
															+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';

															let reasons = '';
															if (t.qus_unpublish_reason_desc) {
															reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
															+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
															+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
															} else {
																reasons = 'Not Applicable';
															}
															this.DOUBLEINTEGER_ELEMENT_DATA.push({
																position: ind,
																question: t.qus_name,
																answer: t.qopt_answer,
																class: t.class_name,
																topic: t.topic_name,
																subtopic: t.st_name,
																info: infoDetails,
																details: Details,
																reasons: reasons,
																action: t
															});
															ind++;
															this.doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
															this.doubleintegerdataSource.paginator = this.paginator;
															this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
															this.doubleintegerdataSource.sort = this.sort;
														}
												}
												// End
												// End
												} else {
														this.tableCollectionSub = false;
														this.tableCollectionMCQ = false;
														this.tableCollectionMULTIMCQ = false;
														this.tableCollectionMatch = false;
														this.tableCollectionTF = false;
														this.tableCollectionMatrix = false;
														this.tableCollectionMatrix45 = false;
														this.tableCollectionSingleInteger = false;
														this.tableCollectionDoubleInteger = false;
														this.notif.showSuccessErrorMessage('No Record Found', 'error');
												}
										}
								);
				}
				if (!this.parameterform.value.qst_id && !this.essayFlag) {
						this.tableCollectionSub = false;
						this.tableCollectionMCQ = false;
						this.tableCollectionMULTIMCQ = false;
						this.tableCollectionMatch = false;
						this.tableCollectionTF = false;
						this.tableCollectionMatrix = false;
						this.tableCollectionMatrix45 = false;
						this.tableCollectionSingleInteger = false;
						this.tableCollectionDoubleInteger = false;
						this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
				} else {
						this.tableCollectionSub = true;
						this.tableCollectionMCQ = true;
						this.tableCollectionMULTIMCQ = true;
						this.tableCollectionTF = true;
						this.tableCollectionMatch = true;
						this.tableCollectionMatrix = true;
						this.tableCollectionMatrix45 = true;
						this.tableCollectionSingleInteger = true;
						this.tableCollectionDoubleInteger = true;
						this.tableCollection = true;
				}
		}
		getHover() {
				for (const item of this.REVIEW_ELEMENT_DATA) {
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
				}
		}
		getColormcqmr(qansa) {
				if (qansa === '1') {
						return '#6c81f7';
				} else {
						return '';
				}
		}

		loadListTemp(templatevalue: number) {
				this.questionsArray = [];
				this.listtemp = templatevalue;
				this.tableCollectionSub = false;
				this.tableCollectionMCQ = false;
				this.tableCollectionMULTIMCQ = false;
				this.tableCollectionTF = false;
				this.tableCollectionMatch = false;
				this.tableCollectionMatrix = false;
				this.tableCollectionMatrix45 = false;
				this.tableCollectionSingleInteger = false;
				this.tableCollectionDoubleInteger = false;
		}

		unpublishQuestion(qus_id) {
				this.questionsArray = [];
				let status: any;
				this.qus_unpublish_remark = this.modalForm.value.qus_unpublish_remark;
				this.reason_id = this.modalForm.value.reason_id;
				if (this.modalForm.valid) {
						if (Number(this.currentUser.role_id) === 1) {
								status = '3';
							} else {
							status = '0';
							}
				this.qelementService.publishUnpublishQuestion(qus_id, status, this.qus_unpublish_remark, this.reason_id, this.currentUser.login_id, '')
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.modalRef2.hide();
												this.getQuestionsReview();
												this.notif.showSuccessErrorMessage('Question unpublished successfully', 'success');
										} else {
												this.notif.showSuccessErrorMessage('Error unpublishing the question', 'error');
										}
								}
						);
						} else {
								this.notif.showSuccessErrorMessage('Please select Reasons and enter remarks', 'error');

						}
		}
		openEssayDetails(value) {
				this.essayDialogRef = this.dialog.open(EssayDialogsComponent, {
						height: '600px',
						width: '1000px',
						data: {
							essayDiv: 'detail',
							ess_id: value.qus_ess_id
						}
					});
		}

		htmlToText(html) {
				return this.htt.htmlToText(html);
		}

		resetquestion() {
				this.parameterform.patchValue({
						'topic_id' : '',
						'st_id' : '',
						'sub_id' : '',
						'class_id' : '',
						'qst_id' : '',
						'qt_id' : '',
						'ess_id': ''
				});
				if (Number(this.listtemp) === 6
					|| Number(this.listtemp) === 7
					|| Number(this.listtemp) === 8
						|| Number(this.listtemp) === 9
						|| Number(this.listtemp) === 10
							|| Number(this.listtemp) === 11
							|| Number(this.listtemp) === 12) {
						this.SUBJECTIVE_ELEMENT_DATA = [];
						this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
						this.tableCollectionSub = false;
				}
				if (Number(this.listtemp) === 1) {
						this.MCQ_ELEMENT_DATA = [];
						this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
						this.tableCollectionMCQ = false;
				}
				if (Number(this.listtemp) === 2) {
						this.MULTI_MCQ_ELEMENT_DATA = [];
						this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
						this.tableCollectionMULTIMCQ = false;
				}
				if (Number(this.listtemp) === 3) {
						this.TF_ELEMENT_DATA = [];
						this.tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
						this.tableCollectionTF = false;
				}
				if (Number(this.listtemp) === 4) {
						this.MATCH_ELEMENT_DATA = [];
						this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
						this.tableCollectionMatch = false;
				}
				if (Number(this.listtemp) === 5) {
						this.MATRIX_MATCH_ELEMENT_DATA = [];
						this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
						this.tableCollectionMatrix = false;
				}
				if (Number(this.listtemp) === 13) {
						this.MATRIX_MATCH_4X5_ELEMENT_DATA = [];
						this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);
						this.tableCollectionMatrix45 = false;
				}
				if (Number(this.listtemp) === 14) {
						this.SINGLEINTEGER_ELEMENT_DATA = [];
						this.singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
						this.tableCollectionSingleInteger = false;
				}
				if (Number(this.listtemp) === 15) {
						this.DOUBLEINTEGER_ELEMENT_DATA = [];
						this.doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
						this.tableCollectionDoubleInteger = false;
				}
				if (this.essayFlag) {
						this.REVIEW_ELEMENT_DATA = [];
						this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
						this.essayFlag = false;
						this.questionlistFlag = false;
				}
		}
		openModal = (data) => this.deleteModalRef.openDeleteModal(data);
		deleteComCancel() {  }
		openModal2(template: TemplateRef<any>) {
				this.modalRef2 = this.modalService.show(template, {
						class: 'modal-sm',
						backdrop: 'static'
				});
		}


}
