import {
		Component, OnInit, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { MCQElement, MultiMCQElement, MatchElement, MatrixMatchElement, TrueFalseElement, MatrixMatch4X5Element, SingleIntegerElement, DoubleIntegerElement } from '../externalreviewobjective/externalobjectiveelement.model';
import { NotificationService, BreadCrumbService, UserAccessMenuService, HtmlToTextService, CommonAPIService } from '../../_services/index';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatDialog } from '@angular/material';
import { EditobjectiveComponent } from '../../questionbank/reviewo/editobjective/editobjective.component';
import { DomSanitizer} from '@angular/platform-browser';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
import { AdminService } from '../../user-type/admin/services/admin.service';
@Component({
		selector: 'app-externalreviewobjective',
		templateUrl: './externalreviewobjective.component.html',
		styleUrls: ['./externalreviewobjective.component.css']
})
export class ExternalreviewobjectiveComponent implements OnInit {

		public ind_entry_form1: FormGroup;
		public ind_entry_form2: FormGroup;
		public ind_entry_form3: FormGroup;
		public mcq_entry_form3: FormGroup;
		public mcqmr_entry_form3: FormGroup;
		public tf_entry_form3: FormGroup;
		public match_entry_form3: FormGroup;
		public matrix_entry_form3: FormGroup;
		public parameterform: FormGroup;
		public questionsArray: any[] = [];
		public questionTypeArray: any[];
		public questionSubtypeArray: any[];
		public subjectArray: any[];
		public classArray: any[];
		public topicArray: any[];
		public subtopicArray: any[];
		public boardArray: any[];
		schoolinfoArray: any = {};
		public skillTypeArray: any[];
		public lodArray: any[];
		public marksArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		public negativemarksArray: any[] = [-1, -2, -3, -4, -5];
		public cqedit: any;
		public listtemp: number;
		public optionHA = ['A', 'B', 'C', 'D'];
		public optionmatchHA = ['P', 'Q', 'R', 'S'];
		public optionmatch4X5HA = ['P', 'Q', 'R', 'S', 'T'];
		public optionTHA = ['True', 'False'];
		homeUrl: string;
		currentQues: any[];
		currentUser: any;
		tableCollectionMCQ: Boolean = false;
		tableCollectionMULTIMCQ: Boolean = false;
		tableCollectionTF: Boolean = false;
		tableCollectionMatch: Boolean = false;
		tableCollectionMatrix: Boolean = false;
		tableCollectionMatrix45: Boolean = false;
		tableCollectionSingleInteger: Boolean = false;
		tableCollectionDoubleInteger: Boolean = false;
		@ViewChild(MatPaginator) paginator: MatPaginator;
		@ViewChild(MatSort) sort: MatSort;
		@ViewChild('deleteModalRef') deleteModalRef;
		MCQ_ELEMENT_DATA: MCQElement[] = [];
		MULTI_MCQ_ELEMENT_DATA: MultiMCQElement[] = [];
		TF_ELEMENT_DATA: TrueFalseElement[] = [];
		MATCH_ELEMENT_DATA: MatchElement[] = [];
		MATRIX_MATCH_ELEMENT_DATA: MatrixMatchElement[] = [];
		MATRIX_MATCH_4X5_ELEMENT_DATA: MatrixMatch4X5Element[] = [];
		// tslint:disable-next-line:max-line-length
		mcqdisplayedColumns = ['position', 'question', 'options', 'explanations', 'class', 'topic', 'subtopic', 'skill', /* 'lod', */ 'reasons', 'action'];
		// tslint:disable-next-line:max-line-length
		multimcqdisplayedColumns = ['positionMulti', 'questionMulti', 'optionsMulti', 'explanationsMulti', 'classMulti', 'topicMulti', 'subtopicMulti', 'skillMulti', /* 'lodMulti', */ 'reasons', 'actionMulti'];
		// tslint:disable-next-line:max-line-length
		tfdisplayedColumns = ['positionTF', 'questionTF', 'optionsTF', 'explanationsTF', 'classTF', 'topicTF', 'subtopicTF', 'skillTF', /* 'lodTF', */ 'reasons', 'actionTF'];
		// tslint:disable-next-line:max-line-length
		matchdisplayedColumns = ['positionMatch', 'questionMatch', 'optionsMatch', 'explanationsMatch', 'classMatch', 'topicMatch', 'subtopicMatch', 'skillMatch', /* 'lodMatch', */ 'reasons', 'actionMatch'];
		// tslint:disable-next-line:max-line-length
		matrixmatchdisplayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'skillMatrixMatch', /* 'lodMatrixMatch', */ 'reasons', 'actionMatrixMatch']; // Matrix Match
		// tslint:disable-next-line:max-line-length
		matrixmatch45displayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'skillMatrixMatch', /* 'lodMatrixMatch', */ 'reasons', 'actionMatrixMatch']; // Matrix Match 4 X 5
		mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
		multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
		tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
		matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
		matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
		matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);

		SINGLEINTEGER_ELEMENT_DATA: SingleIntegerElement[] = [];
		singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
		// tslint:disable-next-line:max-line-length
		singleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'skill', /* 'lod', */ 'reasons', 'action', ];

		DOUBLEINTEGER_ELEMENT_DATA: DoubleIntegerElement[] = [];
		doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
		// tslint:disable-next-line:max-line-length
		doubleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'skill', /* 'lod', */ 'reasons', 'action', ];
		stArrayMcq: any[] = [];
		stArrayMcqmr: any[] = [];
		stArrayTF: any[] = [];
		stArrayMatch: any[] = [];
		stArrayMatrixMatch: any[] = [];
		stArrayMatrixMatch45: any[] = [];
		stArraySingle: any[] = [];
		stArrayDouble: any[] = [];
		allStArray: any[] = [];
		stArrayFinal: any[] = [];
		// tslint:disable-next-line:use-life-cycle-interface
		ngAfterViewInit() {
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
				this.singleintegerdataSource.paginator = this.paginator;
				this.singleintegerdataSource.sort = this.sort;
				this.doubleintegerdataSource.paginator = this.paginator;
				this.doubleintegerdataSource.sort = this.sort;
		}

		applyFilterMCQ(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.mcqdataSource.filter = filterValue;
		}

		applyFilterMultiMCQ(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.multimcqdataSource.filter = filterValue;
		}

		applyFilterTF(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.tfdataSource.filter = filterValue;
		}

		applyFilterMatch(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.matchdataSource.filter = filterValue;
		}

		applyFilterMatrixMatch(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase();
				this.matrixmatchdataSource.filter = filterValue;
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
				private fbuild: FormBuilder,
				private qbankService: QbankService,
				private qelementService: QelementService,
				private htt: HtmlToTextService,
				private notif: NotificationService,
				private breadCrumbService: BreadCrumbService,
				private userAccessMenuService: UserAccessMenuService,
				public dialog: MatDialog,
				private sanitizer: DomSanitizer,
				private commonAPIService: CommonAPIService,
				private acSetupService: AcsetupService,
				private adminService: AdminService
		) { }

		ngOnInit() {
				this.homeUrl = this.breadCrumbService.getUrl();
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
				this.buildForm();
				// this.getQuestionTypeData();
				this.getBoard();
				this.getClass();
				this.getSkillData();
				this.getLodData();
				this.getSchool();
				this.getSubTopicAll();
		}

		buildForm() {
				this.parameterform = this.fbuild.group({
						qst_id: '',
						class_id: '',
						sub_id: '',
						topic_id: '',
						st_id: '',
						from_date: '',
						to_date: ''
				});
		}

		openDialog(question) {
				const dialogRef = this.dialog.open(EditobjectiveComponent, {
						height: '90vh',
						data: {
								question: question,
								listtemp: this.listtemp
						}
				});

				dialogRef.afterClosed().subscribe(result => {
						this.getQuestionsReview();
				});
		}

		getSchool() {
				this.qelementService.getSchool().subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.schoolinfoArray = result.data;
								}
						}
				);
		}

		getSubTopicAll() {
				this.acSetupService.getSubtopicAll().subscribe((result: any) => {
						if (result && result.status === 'ok') {
								this.allStArray = result.data;
								const tempTopicArray: any[] = [];
								for (const item of this.allStArray) {
										const findex = tempTopicArray.findIndex(f => Number(f.topic_id) === Number(item.topic_id));
										if (findex === -1) {
												tempTopicArray.push({
														topic_id: item.topic_id
												});
										}
								}
								const i = 0;
								for (const item of tempTopicArray) {
										const stTempArray: any[] = [];
										for (const all of this.allStArray) {
												if (Number(item.topic_id) === Number(all.topic_id)) {
														stTempArray.push({ st_id: all.st_id, st_name: all.st_name });
												}
										}
										this.stArrayFinal.push({
												topic_id: item.topic_id,
												st_id: stTempArray
										});
								}
						}
				});
		}
		getArrayofSubtopic(topic_id) {
				for (const item of this.stArrayFinal) {
						if (Number(item.topic_id) === Number(topic_id)) {
								return item.st_id;
						}
				}
		}

		htmlToText(html) {
				return this.htt.htmlToText(html);
		}

		isExistUserAccessMenu(mod_id) {
				return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
		}

		getQuestionSubtypeDataByQuestiontype() {
				this.commonAPIService.getQsubtype(2)
						.subscribe(
						(result: any) => {
								if (result) {
										this.questionSubtypeArray = result;
								}
						}
						);
		}

		getQuestionTypeData(): void {
				this.qelementService.getQuestionTypeData()
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.questionTypeArray = result.data;
								}
						}
						);
		}

		getBoard(): void {
				this.qelementService.getBoard()
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.boardArray = result.data;
								}
						}
						);
		}

		getClass() {
				this.qelementService.getClass()
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.classArray = result.data;
										this.getQuestionSubtypeDataByQuestiontype();
								} else {
										this.classArray = [];
										this.notif.showSuccessErrorMessage('No Record Found', 'error');
								}
						}
						);
		}

		getUserAccessSubject(): void {
				let class_id;
				if (this.parameterform.value.class_id) {
						class_id = this.parameterform.value.class_id;
				} else {
						class_id = this.ind_entry_form1.value.qus_class_id;
				}
				this.adminService.getUserAccessSubject({ login_id: this.currentUser.login_id, class_id: class_id })
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.subjectArray = result.data;
								} else {
										this.subjectArray = [];
										// this.errorNotification('No Record Found');
								}
								this.parameterform.patchValue({
										'sub_id': '',
										'topic_id': '',
										'st_id': ''
								});
						}
						);
		}

		getUserAccessTopic(): void {
				let class_id;
				let sub_id;
				if (this.parameterform.value.class_id) {
						class_id = this.parameterform.value.class_id;
				} else {
						class_id = this.ind_entry_form1.value.qus_class_id;
				}
				if (this.parameterform.value.sub_id) {
						sub_id = this.parameterform.value.sub_id;
				} else {
						sub_id = this.ind_entry_form1.value.qus_sub_id;
				}
				this.adminService.getUserAccessTopic({ login_id: this.currentUser.login_id, class_id: class_id, sub_id: sub_id })
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.topicArray = result.data;
								} else {
										// this.errorNotification('No Record Found');
								}
								this.parameterform.patchValue({
										'topic_id': '',
										'st_id': ''
								});
						}
						);
		}

		getSubtopicByTopic(): void {
				let topic_id;
				if (this.parameterform.value.topic_id) {
						topic_id = this.parameterform.value.topic_id;
				} else {
						topic_id = this.ind_entry_form1.value.qus_topic_id;
				}
				this.qelementService.getSubtopicByTopic(topic_id)
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

		getSkillData(): void {
				this.qelementService.getSkillData()
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.skillTypeArray = result.data;
								} else {
										this.notif.showSuccessErrorMessage('No Record Found', 'error');
								}
						}
						);
		}

		getLodData(): void {
				this.qelementService.getLodData()
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.lodArray = result.data;
								} else {
										this.notif.showSuccessErrorMessage('No Record Found', 'error');
								}
						}
						);
		}

		getQuestionsReview() {
				/*Adding Form Validation for Form 1 */
				let isValidForm = true;
				if (!this.parameterform.value.qst_id) {
						this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
						isValidForm = false;
				} else if (!this.parameterform.value.class_id) {
						this.notif.showSuccessErrorMessage('Class is required', 'error');
						isValidForm = false;
				} else if (!this.parameterform.value.sub_id) {
						this.notif.showSuccessErrorMessage('Subject is required', 'error');
						isValidForm = false;
				} else if (!this.parameterform.value.topic_id) {
						this.notif.showSuccessErrorMessage('Topic is required', 'error');
						isValidForm = false;
				}
				/* Form Validation Ends */
				if (isValidForm) {
						let param: any = {};
						param = this.parameterform.value;
						param.qt_id = '2';
						if (Number(this.currentUser.role_id) === 1) {
								param.status = '2';
						} else {
								param.status = '0';
						}
						this.questionsArray = [];
						this.qelementService.getQuestionsInTemplate(param)
								.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.questionsArray = result.data;
												// --------------------MCQ CODE
												// tslint:disable-next-line:triple-equals
												if (Number(this.listtemp) === 1) {
														this.MCQ_ELEMENT_DATA = [];
														this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
														const optionsArray: any[] = [];
														const hoverArray: any[] = [];
														for (let i = 0; i < this.questionsArray.length; i++) {
																optionsArray[i] = '';
																hoverArray[i] = '';
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
																				optionsArray[secondId] = optionsArray[secondId] + '<tr class="correct-mcq-option"><th class="tdTone1"><b>' + this.optionHA[id] + '</b></th>' + '<td class="tdTone2"><b>' + option.qopt_options + '</b></td></tr>';
																		}
																		id++;
																}
																secondId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.MCQ_ELEMENT_DATA.push({
																		position: ind2,
																		question: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		options: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray[ind2 - 1] + '</tbody></table>',
																		explanations: t.qus_explanation,
																		topic: t.topic_name,
																		subtopic: this.stArrayMcq,
																		class: t.class_name,
																		info: '',
																		details: '',
																		skill: this.skillTypeArray,
																		lod: this.lodArray,
																		reasons: reasons,
																		action: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind2++;
																this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
																this.mcqdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.mcqdataSource.sort = this.sort;
														}
														for (const item of this.MCQ_ELEMENT_DATA) {
																this.stArrayMcq = [];
																this.stArrayMcq = this.getArrayofSubtopic(item.topic_id);
																item.subtopic = this.stArrayMcq;
														}
												}
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
																this.stArrayMcqmr = [];
																let id2 = 0;
																for (const option of t.options) {
																		if (option.qopt_answer !== '1') {
																				// tslint:disable-next-line:max-line-length
																				optionsArray2[thirdId] = optionsArray2[thirdId] + '<tr class="option-marking-table"><th class="tdTone1">' + this.optionHA[id2] + '</th>' + '<td class="tdTone2">' + option.qopt_options + '</td></tr>';
																		} else {
																				// tslint:disable-next-line:max-line-length
																				optionsArray2[thirdId] = optionsArray2[thirdId] + '<tr class="correct-mcq-option"><th class="tdTone1"><b>' + this.optionHA[id2] + '</b></th>' + '<td class="tdTone2"><b>' + option.qopt_options + '</b></td></tr>';
																		}
																		id2++;
																}
																thirdId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.MULTI_MCQ_ELEMENT_DATA.push({
																		positionMulti: ind3,
																		questionMulti: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		optionsMulti: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray2[ind3 - 1] + '</tbody></table>',
																		explanationsMulti: t.qus_explanation,
																		classMulti: t.class_name,
																		topicMulti: t.topic_name,
																		subtopicMulti: this.stArrayMcqmr,
																		infoMulti: '',
																		detailsMulti: '',
																		skillMulti: this.skillTypeArray,
																		lodMulti: this.lodArray,
																		reasons: reasons,
																		actionMulti: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind3++;
																this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
																this.multimcqdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.multimcqdataSource.sort = this.sort;
														}
														for (const item of this.MULTI_MCQ_ELEMENT_DATA) {
																this.stArrayMcqmr = [];
																this.stArrayMcqmr = this.getArrayofSubtopic(item.topic_id);
																item.subtopicMulti = this.stArrayMcqmr;
														}
												}
												// ----------------------------------TRUE/FALSE
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
																						optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr><th scope="row" class="tdTone1">' + this.optionHA[id3] + '</th>' + '<td scope="row" class="tdTone2">' + t.options[id3].qopt_options + '</td></tr>';
																				} else {
																						// tslint:disable-next-line:max-line-length
																						optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr class="correct-mcq-option"><th class="tdTone1"><b>' + this.optionHA[id3] + '</b></th>' + '<td class="tdTone2"><b>' + t.options[id3].qopt_options + '</b></td></tr>';
																				}
																				id3++;
																		}
																}
																fourthId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.TF_ELEMENT_DATA.push({
																		positionTF: ind4,
																		questionTF: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		optionsTF: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray3[ind4 - 1] + '</tbody></table>',
																		explanationsTF: t.qus_explanation,
																		classTF: t.class_name,
																		topicTF: t.topic_name,
																		subtopicTF: this.stArrayTF,
																		infoTF: '',
																		detailsTF: '',
																		skillTF: this.skillTypeArray,
																		lodTF: this.lodArray,
																		reasons: reasons,
																		actionTF: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind4++;
																this.tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
																this.tfdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.tfdataSource.sort = this.sort;
														}
														for (const item of this.TF_ELEMENT_DATA) {
																this.stArrayTF = [];
																this.stArrayTF = this.getArrayofSubtopic(item.topic_id);
																item.subtopicTF = this.stArrayTF;
														}
												}
												// ......Match the Folllowing
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
																				optionsArray4[fifthId] = optionsArray4[fifthId] + '<tr class="table-dialog-review-row"><th>' + this.optionHA[id4] + '</th>' + '<td class="changeTd">' + t.options[id4].qopt_options + '</td><th class="changeTh">' + this.optionmatchHA[id4] + '</b></th><td class="changeTd">' + t.options[id4].qopt_options_match + '</td><th>' + this.optionHA[id4] + '</th><th>' + t.options[id4].qopt_answer + '</th></tr>';
																				id4++;
																		}
																}
																fifthId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.MATCH_ELEMENT_DATA.push({
																		positionMatch: ind5,
																		questionMatch: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		optionsMatch: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + optionsArray4[ind5 - 1] + '</tbody></table>',
																		explanationsMatch: t.qus_explanation,
																		classMatch: t.class_name,
																		topicMatch: t.topic_name,
																		subtopicMatch: this.stArrayMatch,
																		infoMatch: '',
																		detailsMatch: '',
																		skillMatch: this.skillTypeArray,
																		lodMatch: this.lodArray,
																		reasons: reasons,
																		actionMatch: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind5++;
																this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
																this.matchdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.matchdataSource.sort = this.sort;
														}
														for (const item of this.MATCH_ELEMENT_DATA) {
																this.stArrayMatch = [];
																this.stArrayMatch = this.getArrayofSubtopic(item.topic_id);
																item.subtopicMatch = this.stArrayMatch;
														}
												}
												// ........Matrix match
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
																while (id9 < 4) {
																		// tslint:disable-next-line:max-line-length
																		answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + this.optionHA[id9] + '</td><td class="changeTd">' + t.options[id9].qopt_options + '</td><td class="changeTd">' + this.optionmatchHA[id9] + '</td><td class="changeTd">' + t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + this.optionHA[id9] + '</td><th class="changeTh">' + answerArray3[id9] + '</th></tr>';
																		id9++;
																}
																ninthId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.MATRIX_MATCH_ELEMENT_DATA.push({
																		positionMatrixMatch: ind6,
																		questionMatrixMatch: t.qus_name,
																		// tslint:disable-next-line:max-line-length
																		answerMatrixMatch: '<table class="dialog-table-review table table-bordered" cellspacing="0"><tbody>' + answerArray[ind6 - 1] + '</tbody></table>',
																		explanationsMatrixMatch: t.qus_explanation,
																		classMatrixMatch: t.class_name,
																		topicMatrixMatch: t.topic_name,
																		subtopicMatrixMatch: this.stArrayMatrixMatch,
																		detailsMatrixMatch: '',
																		reasons: reasons,
																		skillMatrixMatch: this.skillTypeArray,
																		lodMatrixMatch: this.lodArray,
																		actionMatrixMatch: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind6++;
																this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
																this.matrixmatchdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.matrixmatchdataSource.sort = this.sort;
														}
														for (const item of this.MATRIX_MATCH_ELEMENT_DATA) {
																this.stArrayMatrixMatch = [];
																this.stArrayMatrixMatch = this.getArrayofSubtopic(item.topic_id);
																item.subtopicMatrixMatch = this.stArrayMatrixMatch;
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
																while (id9 < 4) {
																		// tslint:disable-next-line:max-line-length
																		answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + this.optionHA[id9] + '</td><td class="changeTd">' + t.options[id9].qopt_options + '</td><td class="changeTd">' + this.optionmatch4X5HA[id9] + '</td><td class="changeTd">' + t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + this.optionHA[id9] + '</td><th class="changeTh">' + answerArray3[id9] + '</th></tr>';
																		id9++;
																}
																if (id9 === 4) {
																		// tslint:disable-next-line:max-line-length
																		answerArray[ninthId] = answerArray[ninthId] + '<tr class="table-dialog-review-row"><td class="changeTd">' + '-' + '</td><td class="changeTd">' + '-' + '</td><td class="changeTd">' + this.optionmatch4X5HA[id9] + '</td><td class="changeTd">' + t.options_match[id9].qopt_options_match + '</td><td class="changeTd">' + '-' + '</td><th class="changeTh">' + '-' + '</th></tr>';
																}
																ninthId++;
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
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
																		subtopicMatrixMatch: this.stArrayMatrixMatch45,
																		detailsMatrixMatch: '',
																		reasons: reasons,
																		skillMatrixMatch: this.skillTypeArray,
																		lodMatrixMatch: this.lodArray,
																		actionMatrixMatch: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind6++;
																this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);
																this.matrixmatch45dataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.matrixmatch45dataSource.sort = this.sort;
														}
														for (const item of this.MATRIX_MATCH_4X5_ELEMENT_DATA) {
																this.stArrayMatrixMatch45 = [];
																this.qelementService.getSubtopicByTopic(item.topic_id).subscribe((result2: any) => {
																		if (result2) {
																				this.stArrayMatrixMatch45 = this.getArrayofSubtopic(item.topic_id);
																				item.subtopicMatrixMatch = this.stArrayMatrixMatch45;
																		}
																});
														}
												}
												// End
												// Single Integer
												if (Number(this.listtemp) === 14) {
														this.SINGLEINTEGER_ELEMENT_DATA = [];
														this.singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
														let ind = 1;
														let t: any;

														for (t of this.questionsArray) {
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.SINGLEINTEGER_ELEMENT_DATA.push({
																		position: ind,
																		question: t.qus_name,
																		answer: t.qopt_answer,
																		class: t.class_name,
																		topic: t.topic_name,
																		subtopic: this.stArraySingle,
																		info: '',
																		details: '',
																		reasons: reasons,
																		skill: this.skillTypeArray,
																		lod: this.lodArray,
																		action: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind++;
																this.singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
																this.singleintegerdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.singleintegerdataSource.sort = this.sort;
														}
														for (const item of this.SINGLEINTEGER_ELEMENT_DATA) {
																this.stArraySingle = [];
																this.stArraySingle = this.getArrayofSubtopic(item.topic_id);
																item.subtopic = this.stArraySingle;
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
																let reasons = '';
																if (t.qus_unpublish_reason_desc) {
																		// tslint:disable-next-line:max-line-length
																		reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>' +
																				'<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>' +
																				'<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
																} else {
																		reasons = 'Not Applicable';
																}
																this.DOUBLEINTEGER_ELEMENT_DATA.push({
																		position: ind,
																		question: t.qus_name,
																		answer: t.qopt_answer,
																		class: t.class_name,
																		topic: t.topic_name,
																		subtopic: this.stArrayDouble,
																		info: '',
																		details: '',
																		reasons: reasons,
																		skill: this.skillTypeArray,
																		lod: this.lodArray,
																		action: t,
																		topic_id: t.qus_topic_id,
																		st_name: t.st_name,
																		skill_name: t.skill_name,
																		dl_name: t.dl_name,
																		tooltip: t.st_name,
																		qus_id: t.qus_id
																});
																ind++;
																this.doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
																this.doubleintegerdataSource.paginator = this.paginator;
																this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
																this.doubleintegerdataSource.sort = this.sort;
														}
														for (const item of this.DOUBLEINTEGER_ELEMENT_DATA) {
																this.stArrayDouble = [];
																this.stArrayDouble = this.getArrayofSubtopic(item.topic_id);
																item.subtopic = this.stArrayDouble;
														}
												}
												// End
												// End
										} else {
												this.questionsArray = [];
												this.tableCollectionMCQ = false;
												this.tableCollectionMULTIMCQ = false;
												this.tableCollectionMatch = false;
												this.tableCollectionTF = false;
												this.tableCollectionMatrix = false;
												this.tableCollectionMatrix45 = false;
												this.tableCollectionSingleInteger = false;
												this.tableCollectionDoubleInteger = false;
												this.notif.showSuccessErrorMessage('No Record found', 'error');
										}
								}
								);
						this.tableCollectionMCQ = true;
						this.tableCollectionMULTIMCQ = true;
						this.tableCollectionTF = true;
						this.tableCollectionMatch = true;
						this.tableCollectionMatrix = true;
						this.tableCollectionMatrix45 = true;
						this.tableCollectionSingleInteger = true;
						this.tableCollectionDoubleInteger = true;
				}
		}

		loadListTemp(templatevalue: number) {
				this.listtemp = templatevalue;
				this.questionsArray = [];
				this.tableCollectionMCQ = false;
				this.tableCollectionMULTIMCQ = false;
				this.tableCollectionTF = false;
				this.tableCollectionMatch = false;
				this.tableCollectionMatrix = false;
				this.tableCollectionMatrix45 = false;
				this.tableCollectionSingleInteger = false;
				this.tableCollectionDoubleInteger = false;
		}

		publishQuestion(qus_id, qus_unpublish_remark) {
				this.qelementService.publishUnpublishQuestion(qus_id, 1, qus_unpublish_remark, '', '', '')
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.getQuestionsReview();
										this.notif.showSuccessErrorMessage('Question published successfully', 'success');
								}
						}
						);
				this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
		}

		deleteQus(value) {
				for (const item of this.questionsArray) {
						if (value === item.qus_id) {
								this.currentQues = item.qus_id;
						}
				}
		}
		deleteQuestion(currentQues) {
				this.qelementService.deleteQuestion(currentQues)
						.subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.getQuestionsReview();
										this.notif.showSuccessErrorMessage('Question deleted successfully', 'success');
								} else {
										this.notif.showSuccessErrorMessage('Error deleting the question', 'error');
								}
						}
						);
		}
		// Reset

		resetquestion() {
				this.parameterform.patchValue({
						'topic_id': '',
						'st_id': '',
						'sub_id': '',
						'class_id': '',
						'qst_id': '',
				});
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
		}

		//


		openModal = (data) => this.deleteModalRef.openDeleteModal(data);

		deleteComCancel() { }

		getMCQMatTooltipData($event, id) {
				for (const item of this.MCQ_ELEMENT_DATA) {
						for (const st of item.subtopic) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.action.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}

		getMCQMRMatTooltipData($event, id) {
				for (const item of this.MULTI_MCQ_ELEMENT_DATA) {
						for (const st of item.subtopicMulti) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.actionMulti.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}

		getTFMatTooltipData($event, id) {
				for (const item of this.TF_ELEMENT_DATA) {
						for (const st of item.subtopicTF) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.actionTF.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}

		getMatchMatTooltipData($event, id) {
				for (const item of this.MATCH_ELEMENT_DATA) {
						for (const st of item.subtopicMatch) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.actionMatch.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}
		getMatrixMatTooltipData($event, id) {
				for (const item of this.MATRIX_MATCH_ELEMENT_DATA) {
						for (const st of item.subtopicMatrixMatch) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.actionMatrixMatch.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}
		getMatrix45TooltipData($event, id) {
				for (const item of this.MATRIX_MATCH_4X5_ELEMENT_DATA) {
						for (const st of item.subtopicMatrixMatch) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.actionMatrixMatch.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}

		getSingleMatTooltipData($event, id) {
				for (const item of this.SINGLEINTEGER_ELEMENT_DATA) {
						for (const st of item.subtopic) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.action.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}

		getDoubleMatTooltipData($event, id) {
				for (const item of this.DOUBLEINTEGER_ELEMENT_DATA) {
						for (const st of item.subtopic) {
								if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
										item.tooltip = st.st_name;
										item.action.qus_st_id = st.st_id;
										break;
								}
						}
				}
		}
		getSkillMCQ(id) {
				for (const item of this.MCQ_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.action.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillMCQMR(id) {
				for (const item of this.MULTI_MCQ_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.actionMulti.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.actionMulti.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillTF(id) {
				for (const item of this.TF_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.actionTF.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.actionTF.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillMatch(id) {
				for (const item of this.MATCH_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.actionMatch.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatch.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillMatrixMatch(id) {
				for (const item of this.MATRIX_MATCH_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.actionMatrixMatch.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatrixMatch.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillMatrixMatch45(id) {
				for (const item of this.MATRIX_MATCH_4X5_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.actionMatrixMatch.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatrixMatch.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillSingle(id) {
				for (const item of this.SINGLEINTEGER_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.action.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getSkillDouble(id) {
				for (const item of this.DOUBLEINTEGER_ELEMENT_DATA) {
						for (const skill of this.skillTypeArray) {
								if (Number(skill.skill_id) === Number(item.action.qus_skill_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_skill_id = skill.skill_id;
										break;
								}
						}
				}
		}
		getLODMCQ(id) {
				for (const item of this.MCQ_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.action.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODMCQMR(id) {
				for (const item of this.MULTI_MCQ_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.actionMulti.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.actionMulti.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODTF(id) {
				for (const item of this.TF_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.actionTF.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.actionTF.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODMatch(id) {
				for (const item of this.MATCH_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.actionMatch.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatch.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODMatrixMatch(id) {
				for (const item of this.MATRIX_MATCH_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.actionMatrixMatch.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatrixMatch.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODMatrixMatch45(id) {
				for (const item of this.MATRIX_MATCH_4X5_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.actionMatrixMatch.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.actionMatrixMatch.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODSingle(id) {
				for (const item of this.SINGLEINTEGER_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.action.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}
		getLODDouble(id) {
				for (const item of this.DOUBLEINTEGER_ELEMENT_DATA) {
						for (const lod of this.lodArray) {
								if (Number(lod.dl_id) === Number(item.action.qus_dl_id) && Number(item.qus_id) === Number(id)) {
										item.action.qus_dl_id = lod.dl_id;
										break;
								}
						}
				}
		}

		updateQuestion(value, publishstatus = '7') {
				this.qbankService.updateQuestion(
						{
								qus_dl_id: value.qus_dl_id,
								qus_skill_id: value.qus_skill_id,
								qus_st_id: value.qus_st_id,
								qus_id: value.qus_id,
								qus_status: value.qus_status

						}).subscribe((result: any) => {
								if (result && result.status === 'ok') {
										this.qelementService.publishUnpublishQuestion(value.qus_id, publishstatus, value.qus_unpublish_remark, '', '', 'external')
												.subscribe(
												(result1: any) => {
														if (result1) {
																this.getQuestionsReview();
																this.notif.showSuccessErrorMessage('Question published successfully', 'success');
														}
												}
												);
								}
						});
		}
}
