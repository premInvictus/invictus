import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { MCQElement, MultiMCQElement, MatchElement, MatrixMatchElement, TrueFalseElement, MatrixMatch4X5Element, SingleIntegerElement, DoubleIntegerElement } from './objectiveelement.model';
import { NotificationService, BreadCrumbService, UserAccessMenuService, HtmlToTextService } from '../../_services/index';
import { CommonAPIService } from 'src/app/_services';
import { QbankService } from '../service/qbank.service';
import { QelementService } from '../service/qelement.service';
import { AdminService } from '../../user-type/admin/services/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditobjectiveComponent } from './editobjective/editobjective.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
	selector: 'app-reviewo',
	templateUrl: './reviewo.component.html',
	styleUrls: ['./reviewo.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})

export class ReviewoComponent implements OnInit {
	modalRef2: BsModalRef;
	modalRef: BsModalRef;
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
	mcqdisplayedColumns = ['position', 'question', 'options', 'explanations', 'class', 'topic', 'subtopic', 'details', 'reasons', 'action'];
	// tslint:disable-next-line:max-line-length
	multimcqdisplayedColumns = ['positionMulti', 'questionMulti', 'optionsMulti', 'explanationsMulti', 'classMulti', 'topicMulti', 'subtopicMulti', 'detailsMulti', 'reasons', 'actionMulti'];
	// tslint:disable-next-line:max-line-length
	tfdisplayedColumns = ['positionTF', 'questionTF', 'optionsTF', 'explanationsTF', 'classTF', 'topicTF', 'subtopicTF', 'detailsTF', 'reasons', 'actionTF'];
	// tslint:disable-next-line:max-line-length
	matchdisplayedColumns = ['positionMatch', 'questionMatch', 'optionsMatch', 'explanationsMatch', 'classMatch', 'topicMatch', 'subtopicMatch', 'detailsMatch', 'reasons', 'actionMatch'];
	// tslint:disable-next-line:max-line-length
	matrixmatchdisplayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'detailsMatrixMatch', 'reasons', 'actionMatrixMatch']; // Matrix Match
	// tslint:disable-next-line:max-line-length
	matrixmatch45displayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'answerMatrixMatch', 'explanationsMatrixMatch', 'classMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'detailsMatrixMatch', 'reasons', 'actionMatrixMatch']; // Matrix Match 4 X 5
	mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
	multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
	tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
	matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
	matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
	matrixmatch45dataSource = new MatTableDataSource<MatrixMatch4X5Element>(this.MATRIX_MATCH_4X5_ELEMENT_DATA);

	SINGLEINTEGER_ELEMENT_DATA: SingleIntegerElement[] = [];
	singleintegerdataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLEINTEGER_ELEMENT_DATA);
	singleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'reasons', 'action',];

	DOUBLEINTEGER_ELEMENT_DATA: DoubleIntegerElement[] = [];
	doubleintegerdataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLEINTEGER_ELEMENT_DATA);
	doubleintegerdisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'reasons', 'action',];
	reasonsArray: any[] = [];
	modalForm: FormGroup;
	currentUnpublishedQues: any;
	qus_unpublish_remark: any;
	reason_id: any;
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
		private modalService: BsModalService,
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private adminService: AdminService,
		private htt: HtmlToTextService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		public dialog: MatDialog,
		private sanitizer: DomSanitizer,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		// this.getQuestionTypeData();
		this.getBoard();
		this.getClass();
		this.getSkillData();
		this.getLodData();
		this.getSchool();
		this.getPublishUnpublishReasons();
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
		this.ind_entry_form1 = this.fbuild.group({
			qus_board_id: '',
			qus_class_id: '',
			qus_sub_id: '',
			qus_topic_id: '',
			qus_st_id: '',
		});
		this.ind_entry_form2 = this.fbuild.group({
			qus_qt_id: '',
			qus_qst_id: '',
			qus_skill_id: '',
			qus_dl_id: '',
			qus_marks: '',
			qus_negative_marks: '',
			qus_time_alloted: '',
			qus_historical_reference: ''
		});
		this.ind_entry_form3 = this.fbuild.group({});
		this.mcq_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_options2: '',
			qopt_options3: '',
			qopt_answer: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
		this.mcqmr_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_options2: '',
			qopt_options3: '',
			qopt_answer0: '',
			qopt_answer1: '',
			qopt_answer2: '',
			qopt_answer3: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
		this.tf_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			qopt_options0: '',
			qopt_options1: '',
			qopt_answer: '',
			qus_explanation: '',
			options: [],
			answer: []
		});
		this.match_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			optiona: '',
			optionp: '',
			apqrs1: '',
			optionb: '',
			optionq: '',
			bpqrs1: '',
			optionc: '',
			optionr: '',
			cpqrs1: '',
			optiond: '',
			optiont: '',
			dpqrs1: '',
			qus_explanation: '',
			options: [],
			options_match: [],
			answer: []
		});
		this.matrix_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			optiona: '',
			optionp: '',
			apqrs1: '',
			apqrs2: '',
			apqrs3: '',
			apqrs4: '',
			optionb: '',
			optionq: '',
			bpqrs1: '',
			bpqrs2: '',
			bpqrs3: '',
			bpqrs4: '',
			optionc: '',
			optionr: '',
			cpqrs1: '',
			cpqrs2: '',
			cpqrs3: '',
			cpqrs4: '',
			optiond: '',
			optiont: '',
			dpqrs1: '',
			dpqrs2: '',
			dpqrs3: '',
			dpqrs4: '',
			qus_explanation: '',
			options: [],
			options_match: [],
			answer: []
		});
		this.modalForm = this.fbuild.group({
			qus_unpublish_remark: ['', Validators.required],
			reason_id: ['', Validators.required],
		});
	}
	getPublishUnpublishReasons() {
		this.qelementService.publishUnpublishReason({ reason_type: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonsArray = result.data;
			}
		});
	}
	getCurrentUnpublishedQues(value) {
		this.currentUnpublishedQues = value;
	}
	openDialog(question) {
		const dialogRef = this.dialog.open(EditobjectiveComponent, {
			height: '90vh',
			data: { question: question, listtemp: this.listtemp }
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getQuestionsReview();
		});
	}

	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
				}
			}
		);
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

	getSubjectsByClass(): void {
		let class_id;
		if (this.parameterform.value.class_id) {
			class_id = this.parameterform.value.class_id;
		} else {
			class_id = this.ind_entry_form1.value.qus_class_id;
		}
		if (this.currentUser.role_id === '1') {
			this.adminService.getUserAccessSubject({ login_id: this.currentUser.login_id, class_id: class_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			});
		} else {
			this.qelementService.getSubjectsByClass(class_id)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.subjectArray = result.data;
						} else {
							this.subjectArray = [];
							// this.errorNotification('No Record Found');
						}
					}
				);
		}
		this.parameterform.patchValue({
			'sub_id': '',
			'topic_id': '',
			'st_id': ''
		});
	}

	getTopicByClassSubject(): void {
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
		if (this.currentUser.role_id === '1') {
			// tslint:disable-next-line:max-line-length
			this.adminService.getUserAccessTopic({ login_id: this.currentUser.login_id, class_id: class_id, sub_id: sub_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
				}
			});
		} else {
			this.qelementService.getTopicByClassSubject(class_id, sub_id)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.topicArray = result.data;
						} else {
							this.topicArray = [];
						}
					}
				);
		}
		this.parameterform.patchValue({
			'topic_id': '',
			'st_id': ''
		});
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
			isValidForm = false;
			this.tableCollectionMCQ = false;
			this.tableCollectionMULTIMCQ = false;
			this.tableCollectionMatch = false;
			this.tableCollectionTF = false;
			this.tableCollectionMatrix = false;
			this.tableCollectionMatrix45 = false;
			this.tableCollectionSingleInteger = false;
			this.tableCollectionDoubleInteger = false;
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		/* Form Validation Ends */
		if (isValidForm) {
			let param: any = {};
			param = this.parameterform.value;
			param.qt_id = '2';
			if (Number(this.currentUser.role_id) === 1) {
				param.status = '3';
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
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details
										+ '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
										subtopic: t.st_name,
										class: t.class_name,
										info: infoDetails,
										details: Details,
										reasons: reasons,
										action: t
									});
									ind2++;
									this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
									this.mcqdataSource.paginator = this.paginator;
									this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
									this.mcqdataSource.sort = this.sort;
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
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
										subtopicMulti: t.st_name,
										infoMulti: infoDetails,
										detailsMulti: Details,
										reasons: reasons,
										actionMulti: t
									});
									ind3++;
									this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
									this.multimcqdataSource.paginator = this.paginator;
									this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
									this.multimcqdataSource.sort = this.sort;
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
												optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr class="option-marking-table"><th scope="row" class="tdTone1">' + this.optionHA[id3] + '</th>' + '<td scope="row" class="tdTone2">' + t.options[id3].qopt_options + '</td></tr>';
											} else {
												// tslint:disable-next-line:max-line-length
												optionsArray3[fourthId] = optionsArray3[fourthId] + '<tr class="correct-mcq-option"><th class="tdTone1"><b>' + this.optionHA[id3] + '</b></th>' + '<td class="tdTone2"><b>' + t.options[id3].qopt_options + '</b></td></tr>';
											}
											id3++;
										}
									}
									fourthId++;
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
										subtopicTF: t.st_name,
										infoTF: infoDetails,
										detailsTF: Details,
										reasons: reasons,
										actionTF: t
									});
									ind4++;
									this.tfdataSource = new MatTableDataSource<TrueFalseElement>(this.TF_ELEMENT_DATA);
									this.tfdataSource.paginator = this.paginator;
									this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
									this.tfdataSource.sort = this.sort;
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
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
										subtopicMatch: t.st_name,
										infoMatch: infoDetails,
										detailsMatch: Details,
										reasons: reasons,
										actionMatch: t
									});
									ind5++;
									this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
									this.matchdataSource.paginator = this.paginator;
									this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
									this.matchdataSource.sort = this.sort;
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
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
										subtopicMatrixMatch: t.st_name,
										detailsMatrixMatch: Details,
										reasons: reasons,
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
									let infoDetails = '';
									// tslint:disable-next-line:max-line-length
									infoDetails = infoDetails + '<span class="badge badge-secondary">Class:' + t.class_name + '</span><br>' + '<span class="badge badge-secondary">Subject:' + t.sub_name + '</span><br>' + '<span class="badge badge-secondary"> Topic:' + t.topic_name + '</span><br>' + '<span class="badge badge-secondary">Sub-Topic:' + t.st_name + '</span>';
									let Details = '';
									// tslint:disable-next-line:max-line-length
									Details = Details + '<span>Subject:&nbsp;&nbsp' + t.sub_name + '</span><br>'
										+ '<span>Skill:&nbsp;&nbsp' + t.skill_name + '</span><br>'
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';
									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
										reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
											+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
											+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
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
							// End
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
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';

									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
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
										+ '<span>Suggested Marks:&nbsp;&nbsp' + t.qus_marks + '</span><br>'
										+ '<span>Time:&nbsp;&nbsp' + t.qus_time_alloted + '</span><br>'
										+ '<span>Neg Marks:&nbsp;&nbsp' + t.qus_negative_marks + '</span><br>'
										+ '<span>Ref:&nbsp;&nbsp' + t.qus_historical_reference + '</span>';

									let reasons = '';
									if (t.qus_unpublish_reason_desc) {
										// tslint:disable-next-line:max-line-length
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
	editObjectiveForm(question) {
		this.ind_entry_form1.patchValue({
			'qus_board_id': question.qus_board_id,
			'qus_class_id': question.qus_class_id,
			'qus_sub_id': question.qus_sub_id,
			'qus_topic_id': question.qus_topic_id,
			'qus_st_id': question.qus_st_id
		});
		this.ind_entry_form2.setValue({
			'qus_qt_id': question.qus_qt_id,
			'qus_qst_id': question.qus_qst_id,
			'qus_skill_id': question.qus_skill_id,
			'qus_dl_id': question.qus_dl_id,
			'qus_marks': question.qus_marks,
			'qus_negative_marks': question.qus_negative_marks,
			'qus_time_alloted': question.qus_time_alloted,
			'qus_historical_reference': question.qus_historical_reference
		});
		this.getSubjectsByClass();
		this.getTopicByClassSubject();
		this.getSubtopicByTopic();
		if (Number(question.qus_qst_id) === 1) {
			this.mcq_entry_form3.patchValue({
				'qus_id': question.qus_id,
				'qus_name': question.qus_name
			});
			for (let oi = 0; oi < question.options.length; oi++) {
				if (Number(oi) === 0) {
					this.mcq_entry_form3.patchValue({
						'qopt_options0': question.options[oi].qopt_options,
					});
				} else if (Number(oi) === 1) {
					this.mcq_entry_form3.patchValue({
						'qopt_options1': question.options[oi].qopt_options,
					});
				} else if (Number(oi) === 2) {
					this.mcq_entry_form3.patchValue({
						'qopt_options2': question.options[oi].qopt_options,
					});
				} else if (Number(oi) === 3) {
					this.mcq_entry_form3.patchValue({
						'qopt_options3': question.options[oi].qopt_options,
					});
				}
			}
			for (let ai = 0; ai < question.options.length; ai++) {
				if (question.options[ai].qopt_answer === '1') {
					this.mcq_entry_form3.patchValue({
						' qopt_answer': (ai + '')
					});
				}
			}
			this.mcq_entry_form3.patchValue({
				'qus_explanation': question.qus_explanation
			});
		} else if (Number(question.qus_qst_id) === 2) {
			this.mcqmr_entry_form3.patchValue({
				'qus_id': question.qus_id,
				'qus_name': question.qus_name
			});
			for (let oi = 0; oi < question.options.length; oi++) {
				if (Number(oi) === 0) {
					this.mcqmr_entry_form3.patchValue({
						'qopt_options0': question.options[oi].qopt_options,
						'qopt_answer0': (Number(question.options[oi].qopt_answer) === 1 ? true : false)
					});
				} else if (Number(oi) === 1) {
					this.mcqmr_entry_form3.patchValue({
						'qopt_options1': question.options[oi].qopt_options,
						'qopt_answer1': (Number(question.options[oi].qopt_answer) === 1 ? true : false)
					});
				} else if (Number(oi) === 2) {
					this.mcqmr_entry_form3.patchValue({
						'qopt_options2': question.options[oi].qopt_options,
						'qopt_answer2': (Number(question.options[oi].qopt_answer) === 1 ? true : false)
					});
				} else if (Number(oi) === 3) {
					this.mcqmr_entry_form3.patchValue({
						'qopt_options3': question.options[oi].qopt_options,
						'qopt_answer3': (Number(question.options[oi].qopt_answer) === 1 ? true : false)
					});
				}
			}
			this.mcqmr_entry_form3.patchValue({
				'qus_explanation': question.qus_explanation
			});
		} else if (Number(question.qus_qst_id) === 3) {
			this.tf_entry_form3.patchValue({
				'qus_id': question.qus_id,
				'qus_name': question.qus_name
			});
			for (let oi = 0; oi < question.options.length; oi++) {
				if (Number(oi) === 0) {
					this.tf_entry_form3.patchValue({
						'qopt_options0': question.options[oi].qopt_options
					});
				} else if (Number(oi) === 1) {
					this.tf_entry_form3.patchValue({
						'qopt_options1': question.options[oi].qopt_options
					});
				}
			}
			for (let ai = 0; ai < question.options.length; ai++) {
				if (question.options[ai].qopt_answer === '1') {
					this.tf_entry_form3.patchValue({
						'qopt_answer': (ai + '')
					});
				}
			}
			this.tf_entry_form3.patchValue({
				'qus_explanation': question.qus_explanation
			});
		} else if (Number(question.qus_qst_id) === 4) {
			this.match_entry_form3.patchValue({
				'qus_id': question.qus_id,
				'qus_name': question.qus_name
			});
			for (let oi = 0; oi < question.options.length; oi++) {
				if (Number(oi) === 0) {
					this.match_entry_form3.patchValue({
						optiona: question.options[oi].qopt_options,
						optionp: question.options[oi].qopt_options_match,
						apqrs1: question.options[oi].qopt_answer
					});
				} else if (Number(oi) === 1) {
					this.match_entry_form3.patchValue({
						optionb: question.options[oi].qopt_options,
						optionq: question.options[oi].qopt_options_match,
						bpqrs1: question.options[oi].qopt_answer
					});
				} else if (Number(oi) === 2) {
					this.match_entry_form3.patchValue({
						optionc: question.options[oi].qopt_options,
						optionr: question.options[oi].qopt_options_match,
						cpqrs1: question.options[oi].qopt_answer
					});
				} else if (Number(oi) === 3) {
					this.match_entry_form3.patchValue({
						optiond: question.options[oi].qopt_options,
						optiont: question.options[oi].qopt_options_match,
						dpqrs1: question.options[oi].qopt_answer
					});
				}
			}
			this.match_entry_form3.patchValue({
				'qus_explanation': question.qus_explanation
			});
		} else if (Number(question.qus_qst_id) === 5) {
			this.matrix_entry_form3.patchValue({
				'qus_id': question.qus_id,
				'qus_name': question.qus_name
			});
			for (let oi = 0; oi < question.options.length; oi++) {
				if (Number(oi) === 0) {
					this.matrix_entry_form3.patchValue({
						'optiona': question.options[oi].qopt_options
					});
				} else if (Number(oi) === 1) {
					this.matrix_entry_form3.patchValue({
						'optionb': question.options[oi].qopt_options
					});
				} else if (Number(oi) === 2) {
					this.matrix_entry_form3.patchValue({
						'optionc': question.options[oi].qopt_options
					});
				} else if (Number(oi) === 3) {
					this.matrix_entry_form3.patchValue({
						'optiond': question.options[oi].qopt_options
					});
				}
			}
			for (let omi = 0; omi < question.options_match.length; omi++) {
				if (Number(omi) === 0) {
					this.matrix_entry_form3.patchValue({
						'optionp': question.options_match[omi].qopt_options_match
					});
				} else if (Number(omi) === 1) {
					this.matrix_entry_form3.patchValue({
						'optionq': question.options_match[omi].qopt_options_match
					});
				} else if (Number(omi) === 2) {
					this.matrix_entry_form3.patchValue({
						'optionr': question.options_match[omi].qopt_options_match
					});
				} else if (Number(omi) === 3) {
					this.matrix_entry_form3.patchValue({
						'optiont': question.options_match[omi].qopt_options_match
					});
				}
			}
			for (let ai = 0; ai < question.answer.length; ai++) {
				if (Number(ai) === 0) {
					this.matrix_entry_form3.patchValue({
						'apqrs1': question.answer[ai][0].qopt_answer,
						'apqrs2': question.answer[ai][1].qopt_answer,
						'apqrs3': question.answer[ai][2].qopt_answer,
						'apqrs4': question.answer[ai][3].qopt_answer
					});
				} else if (Number(ai) === 1) {
					this.matrix_entry_form3.patchValue({
						'bpqrs1': question.answer[ai][0].qopt_answer,
						'bpqrs2': question.answer[ai][1].qopt_answer,
						'bpqrs3': question.answer[ai][2].qopt_answer,
						'bpqrs4': question.answer[ai][3].qopt_answer
					});
				} else if (Number(ai) === 2) {
					this.matrix_entry_form3.patchValue({
						'cpqrs1': question.answer[ai][0].qopt_answer,
						'cpqrs2': question.answer[ai][1].qopt_answer,
						'cpqrs3': question.answer[ai][2].qopt_answer,
						'cpqrs4': question.answer[ai][3].qopt_answer
					});
				} else if (Number(ai) === 3) {
					this.matrix_entry_form3.patchValue({
						'dpqrs1': question.answer[ai][0].qopt_answer,
						'dpqrs2': question.answer[ai][1].qopt_answer,
						'dpqrs3': question.answer[ai][2].qopt_answer,
						'dpqrs4': question.answer[ai][3].qopt_answer
					});
				}
			}
			this.matrix_entry_form3.patchValue({
				'qus_explanation': question.qus_explanation
			});
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
	updateQuestion(): void {
		if (Number(this.listtemp) === 1) {
			const options: any[] = [];
			const answer: any[] = [];
			let optionsLength = 0;
			if (this.mcq_entry_form3.value.qopt_options0) {
				options[0] = {
					'qopt_options': this.mcq_entry_form3.value.qopt_options0
				};
				optionsLength++;
			}
			if (this.mcq_entry_form3.value.qopt_options1) {
				options[1] = {
					'qopt_options': this.mcq_entry_form3.value.qopt_options1
				};
				optionsLength++;
			}
			if (this.mcq_entry_form3.value.qopt_options2) {
				options[2] = {
					'qopt_options': this.mcq_entry_form3.value.qopt_options2
				};
				optionsLength++;
			}
			if (this.mcq_entry_form3.value.qopt_options3) {
				options[3] = {
					'qopt_options': this.mcq_entry_form3.value.qopt_options3
				};
				optionsLength++;
			}
			this.mcq_entry_form3.patchValue({
				'options': options
			});
			for (let i = 0; i < optionsLength; i++) {
				if (i === Number(this.mcq_entry_form3.value.qopt_answer)) {
					answer[i] = {
						'qopt_answer': '1'
					};
				} else {
					answer[i] = {
						'qopt_answer': '0'
					};
				}
			}
			this.mcq_entry_form3.patchValue({
				'answer': answer
			});
			this.ind_entry_form3 = this.mcq_entry_form3;
		} else if (Number(this.listtemp) === 2) {
			const options: any[] = [];
			const answer: any[] = [];
			if (this.mcqmr_entry_form3.value.qopt_options0) {
				options[0] = {
					'qopt_options': this.mcqmr_entry_form3.value.qopt_options0
				};
				answer[0] = {
					'qopt_answer': this.mcqmr_entry_form3.value.qopt_answer0 === true ? 1 : 0
				};
			}
			if (this.mcqmr_entry_form3.value.qopt_options1) {
				options[1] = {
					'qopt_options': this.mcqmr_entry_form3.value.qopt_options1
				};
				answer[1] = {
					'qopt_answer': this.mcqmr_entry_form3.value.qopt_answer1 === true ? 1 : 0
				};
			}
			if (this.mcqmr_entry_form3.value.qopt_options2) {
				options[2] = {
					'qopt_options': this.mcqmr_entry_form3.value.qopt_options2
				};
				answer[2] = {
					'qopt_answer': this.mcqmr_entry_form3.value.qopt_answer2 === true ? 1 : 0
				};
			}
			if (this.mcqmr_entry_form3.value.qopt_options3) {
				options[3] = {
					'qopt_options': this.mcqmr_entry_form3.value.qopt_options3
				};
				answer[3] = {
					'qopt_answer': this.mcqmr_entry_form3.value.qopt_answer3 === true ? 1 : 0
				};
			}
			this.mcqmr_entry_form3.patchValue({
				'options': options,
				'answer': answer
			});
			this.ind_entry_form3 = this.mcqmr_entry_form3;
		} else if (Number(this.listtemp) === 3) {
			const options: any[] = [];
			const answer: any[] = [];
			options[0] = {
				'qopt_options': 'True'
			};
			options[1] = {
				'qopt_options': 'False'
			};
			for (let i = 0; i < 2; i++) {
				if (i === Number(this.tf_entry_form3.value.qopt_answer)) {
					answer[i] = {
						'qopt_answer': '1'
					};
				} else {
					answer[i] = {
						'qopt_answer': '0'
					};
				}
			}
			this.tf_entry_form3.patchValue({
				'options': options,
				'answer': answer
			});
			this.ind_entry_form3 = this.tf_entry_form3;
		} else if (Number(this.listtemp) === 4) {
			const options: any[] = [];
			const options_match: any[] = [];
			const answer: any[] = [];
			options[0] = {
				'qopt_options': this.match_entry_form3.value.optiona
			};
			options[1] = {
				'qopt_options': this.match_entry_form3.value.optionb
			};
			options[2] = {
				'qopt_options': this.match_entry_form3.value.optionc
			};
			options[3] = {
				'qopt_options': this.match_entry_form3.value.optiond
			};
			this.match_entry_form3.patchValue({
				'options': options,
			});
			options_match[0] = {
				'qopt_options_match': this.match_entry_form3.value.optionp
			};
			options_match[1] = {
				'qopt_options_match': this.match_entry_form3.value.optionq
			};
			options_match[2] = {
				'qopt_options_match': this.match_entry_form3.value.optionr
			};
			options_match[3] = {
				'qopt_options_match': this.match_entry_form3.value.optiont
			};
			this.match_entry_form3.patchValue({
				'options_match': options_match
			});
			answer[0] = {
				'qopt_answer': this.match_entry_form3.value.apqrs1
			};
			answer[1] = {
				'qopt_answer': this.match_entry_form3.value.bpqrs1
			};
			answer[2] = {
				'qopt_answer': this.match_entry_form3.value.cpqrs1
			};
			answer[3] = {
				'qopt_answer': this.match_entry_form3.value.dpqrs1
			};
			this.match_entry_form3.patchValue({
				'answer': answer
			});
			this.ind_entry_form3 = this.match_entry_form3;
		} else if (Number(this.listtemp) === 5) {
			const options: any[] = [];
			const options_match: any[] = [];
			const answer: any[] = [];
			// options
			options[0] = {
				'qopt_options': this.matrix_entry_form3.value.optiona
			};
			options[1] = {
				'qopt_options': this.matrix_entry_form3.value.optionb
			};
			options[2] = {
				'qopt_options': this.matrix_entry_form3.value.optionc
			};
			options[3] = {
				'qopt_options': this.matrix_entry_form3.value.optiond
			};
			// options_match
			options_match[0] = {
				'qopt_options_match': this.matrix_entry_form3.value.optionp
			};
			options_match[1] = {
				'qopt_options_match': this.matrix_entry_form3.value.optionq
			};
			options_match[2] = {
				'qopt_options_match': this.matrix_entry_form3.value.optionr
			};
			options_match[3] = {
				'qopt_options_match': this.matrix_entry_form3.value.optiont
			};
			// answer
			answer[0] = {
				'qopt_answer': this.matrix_entry_form3.value.apqrs1
			};
			answer[1] = {
				'qopt_answer': this.matrix_entry_form3.value.apqrs2
			};
			answer[2] = {
				'qopt_answer': this.matrix_entry_form3.value.apqrs3
			};
			answer[3] = {
				'qopt_answer': this.matrix_entry_form3.value.apqrs4
			};
			answer[4] = {
				'qopt_answer': this.matrix_entry_form3.value.bpqrs1
			};
			answer[5] = {
				'qopt_answer': this.matrix_entry_form3.value.bpqrs2
			};
			answer[6] = {
				'qopt_answer': this.matrix_entry_form3.value.bpqrs3
			};
			answer[7] = {
				'qopt_answer': this.matrix_entry_form3.value.bpqrs4
			};
			answer[8] = {
				'qopt_answer': this.matrix_entry_form3.value.cpqrs1
			};
			answer[9] = {
				'qopt_answer': this.matrix_entry_form3.value.cpqrs2
			};
			answer[10] = {
				'qopt_answer': this.matrix_entry_form3.value.cpqrs3
			};
			answer[11] = {
				'qopt_answer': this.matrix_entry_form3.value.cpqrs4
			};
			answer[12] = {
				'qopt_answer': this.matrix_entry_form3.value.dpqrs1
			};
			answer[13] = {
				'qopt_answer': this.matrix_entry_form3.value.dpqrs2
			};
			answer[14] = {
				'qopt_answer': this.matrix_entry_form3.value.dpqrs3
			};
			answer[15] = {
				'qopt_answer': this.matrix_entry_form3.value.dpqrs4
			};
			this.matrix_entry_form3.patchValue({
				'options': options,
				'options_match': options_match,
				'answer': answer
			});
			this.ind_entry_form3 = this.matrix_entry_form3;
		}
		const resultobj = {};
		const jsonobj1 = JSON.parse(JSON.stringify(this.ind_entry_form1.value));
		const jsonobj2 = JSON.parse(JSON.stringify(this.ind_entry_form2.value));
		const jsonobj3 = JSON.parse(JSON.stringify(this.ind_entry_form3.value));
		for (const key in jsonobj1) {
			if (jsonobj1.hasOwnProperty(key)) {
				resultobj[key] = jsonobj1[key];
			}
		}
		for (const key in jsonobj2) {
			if (jsonobj2.hasOwnProperty(key)) {
				resultobj[key] = jsonobj2[key];
			}
		}
		for (const key in jsonobj3) {
			if (jsonobj3.hasOwnProperty(key)) {
				resultobj[key] = jsonobj3[key];
			}
		}
		if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid) {
			this.qbankService.updateQuestion(resultobj)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question Updated Successfully', 'success');
							this.getQuestionsReview();
						} else {
							this.notif.showSuccessErrorMessage('Error updating the Question', 'error');
						}
					}
				);
		} else {
			this.notif.showSuccessErrorMessage('Error updating the Question', 'error');
		}
		this.ind_entry_form3.reset();
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);

	deleteComCancel() { }
	unpublishQuestion(qus_id) {
		this.questionsArray = [];
		this.qus_unpublish_remark = this.modalForm.value.qus_unpublish_remark;
		this.reason_id = this.modalForm.value.reason_id;
		if (this.modalForm.valid) {
			let qus_status = '2';
			if (this.currentUser.role_id === '1') {
				qus_status = '7';
			}
			// tslint:disable-next-line:max-line-length
			this.qelementService.publishUnpublishQuestion(qus_id, qus_status, this.qus_unpublish_remark, this.reason_id, this.currentUser.login_id, '')
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
	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, {
			class: 'modal-sm',
			backdrop: 'static'
		});
	}
	openModalUnpublish(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {
			class: 'modal-sm',
		});
	}
}
