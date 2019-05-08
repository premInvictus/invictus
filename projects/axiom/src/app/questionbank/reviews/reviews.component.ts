import { ChangeDetectorRef, Component, OnInit, ViewChild, Injectable, Inject, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QbankService } from '../service/qbank.service';
import { QelementService } from '../service/qelement.service';
import { AdminService } from '../../user-type/admin/services/admin.service';
import { NotificationService, BreadCrumbService, HtmlToTextService, UserAccessMenuService, CommonAPIService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SubjectiveElement } from './subjectiveelement.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer} from '@angular/platform-browser';
import { ckconfig } from '../ckeditorconfig';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
	selector: 'app-reviews',
	templateUrl: './reviews.component.html',
	styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent implements OnInit {
	modalRef2: BsModalRef;
	modalRef: BsModalRef;
	public ind_entry_form1: FormGroup;
	public ind_entry_form2: FormGroup;
	public sub_entry_form3: FormGroup;
	public ind_entry_form3: FormGroup;
	public parameterform: FormGroup;
	public questionsArray: any[] = [];
	public questionTypeArray: any[];
	public questionSubtypeArray: any[];
	currentQues: any[];
	public subjectArray: any[];
	public classArray: any[];
	public topicArray: any[];
	public subtopicArray: any[];
	public boardArray: any[];
	schoolinfoArray: any = {};
	public skillTypeArray: any[];
	public lodArray: any[];
	public timeallotedArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 10];

	public marksArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	public negativemarksArray: any[] = [-1, -2, -3, -4, -5];
	public listtemp: number;
	tableCollection: Boolean = false;
	homeUrl: string;
	currentUser: any;
	username: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	SUBJECTIVE_ELEMENT_DATA: SubjectiveElement[] = [];
	subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
	subjectivedisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'reasons', 'action', ];
	ckeConfig: any;
	reasonsArray: any[] = [];
	modalForm: FormGroup;
	reason_id: any;
	currentUnpublishedQues: any;
	public qus_unpublish_remark: any;
	constructor(
		private modalService: BsModalService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private qbankService: QbankService,
		private adminService: AdminService,
		private htt: HtmlToTextService,
		private commonAPIService: CommonAPIService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		public dialog: MatDialog,
		public sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getBoard();
		this.getClass();
		this.getSchool();
		// this.getQuestionTypeData();
		this.getSkillData();
		this.getLodData();
		this.getPublishUnpublishReasons();
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngAfterViewInit() {
		this.subjectivedataSource.paginator = this.paginator;
		this.subjectivedataSource.sort = this.sort;
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	applyFilterSubjective(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); // Remove whitespace
		this.subjectivedataSource.filter = filterValue;

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
			qus_status: ''
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
		this.sub_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			qopt_answer: '',
			qus_explanation: '',
			answer: ''
		});
		this.ind_entry_form3 = this.fbuild.group({});
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

	openDialog(question) {
		const dialogRef = this.dialog.open(EditSubjectiveDialog, {
			disableClose: true,
			height: '550px',
			data: {
				question: question,
				listtemp: this.listtemp,
				qst_id: '',
				class_id: '',
				sub_id: '',
				topic_id: '',
				st_id: '',
				from_date: '',
				to_date: ''
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getQuestionsReview();
		});
	}
	getCurrentUnpublishedQues(value) {
		this.currentUnpublishedQues = value;
	}

	getQuestionSubtypeDataByQuestiontype() {
		this.commonAPIService.getQsubtype(1).subscribe(
			(result: any) => {
				if (result) {
					this.questionSubtypeArray = result;
				}
			}
		);
	}

	getBoard(): void {
		this.qelementService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.boardArray = result.data;
				}
			}
		);
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					this.getQuestionSubtypeDataByQuestiontype();
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
		this.qelementService.getSubtopicByTopic(topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				} else {
					this.subtopicArray = [];
				}
			}
		);
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

	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				}
			}
		);
	}
	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				}
			}
		);
	}

	getQuestionsReview() {
		this.SUBJECTIVE_ELEMENT_DATA = [];
		this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
		this.questionsArray = [];
		let param: any = {};
		param = this.parameterform.value;
		if (Number(this.currentUser.role_id) === 1) {
			param.status = '3';
		} else {
			param.status = '0';
		}
		this.qelementService.getQuestionsInTemplate(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionsArray = result.data;
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
							reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qus_unpublish_reason_desc + '</span><br>'
								+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
								+ '<span>Unpublisher:&nbsp;&nbsp' + t.qus_unpublish_by_user_name + '</span>';
						} else {
							reasons = 'Not Applicable';
						}
						this.SUBJECTIVE_ELEMENT_DATA.push({
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
						this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
						this.subjectivedataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.subjectivedataSource.sort = this.sort;
					}
				} else {
					this.tableCollection = false;
					this.notif.showSuccessErrorMessage('No records found', 'error');
				}
			}
		);
		if (!this.parameterform.value.qst_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		} else {
			this.tableCollection = true;
		}

	}



	loadListTemp(templatevalue: number) {
		this.listtemp = templatevalue;
		this.questionsArray = [];
		this.tableCollection = false;
	}
	publishQuestion(qus_id, qus_unpublish_remark) {
		this.qelementService.publishUnpublishQuestion(qus_id, 1, qus_unpublish_remark, '', '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQuestionsReview();
					this.notif.showSuccessErrorMessage('Question published successfully', 'success');
				}
			}
		);
	}
	// delete question on modal
	deleteQus(value) {
		for (const item of this.questionsArray) {
			if (value === item.qus_id) {
				this.currentQues = item.qus_id;
			}
		}
	}

	deleteQuestion(currentQues) {
		this.qelementService.deleteQuestion(currentQues).subscribe(
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
	editSubjectiveForm(question) {
		this.getSubjectsByClass();
		this.getTopicByClassSubject();
		this.getTopicByClassSubject();
		this.getSubtopicByTopic();
		this.ind_entry_form1.patchValue({
			'qus_board_id': question.qus_board_id,
			'qus_class_id': question.qus_class_id,
			'qus_sub_id': question.qus_sub_id,
			'qus_topic_id': question.qus_topic_id,
			'qus_st_id': question.st_id
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
		this.sub_entry_form3.patchValue({
			'qus_id': question.qus_id,
			'qus_name': question.qus_name,
			'qopt_answer': question.qopt_answer,
			'qus_explanation': question.qus_explanation,
			'answer': question.answer
		});
	}

	updateQuestion() {
		const subQtype = this.listtemp;
		// tslint:disable-next-line:triple-equals
		if (subQtype == 6 || subQtype == 7 || subQtype == 8 || subQtype == 9 || subQtype == 10 || subQtype || subQtype == 12) {
			let answer: any;
			if (this.sub_entry_form3.value.qopt_answer) {
				answer = {
					'qopt_answer': this.sub_entry_form3.value.qopt_answer
				};
			}
			this.sub_entry_form3.patchValue({
				'answer': answer,
			});
			this.ind_entry_form3 = this.sub_entry_form3;
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
		if (Number(this.currentUser.role_id) !== 1) {
			resultobj['qus_status'] = '0';
		}
		if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid) {
			this.qbankService.updateQuestion(resultobj)
				.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Question updated successfully', 'success');
						this.getQuestionsReview();
					} else {
						this.notif.showSuccessErrorMessage('Error updating the question', 'error');
					}
				}
				);
		} else {
			this.notif.showSuccessErrorMessage('Error updating the question', 'error');
		}
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);

	deleteComCancel() { }
	openModalUnpublish(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {
			class: 'modal-sm',
		});
	}
	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, {
			class: 'modal-sm',
			backdrop: 'static'
		});
	}
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
}


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'editsubjective',
	templateUrl: './editsubjective.html',
})

// tslint:disable-next-line:component-class-suffix
export class EditSubjectiveDialog implements OnInit, OnDestroy {
	public ind_entry_form1: FormGroup;
	public ind_entry_form2: FormGroup;
	public sub_entry_form3: FormGroup;
	public ind_entry_form3: FormGroup;
	public parameterform: FormGroup;
	public questionsArray: any[] = [];
	public questionTypeArray: any[];
	public questionSubtypeArray: any[];
	currentQues: any[];
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
	public timeallotedArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 10];
	public listtemp: number;
	tableCollection: Boolean = false;
	homeUrl: string;
	currentUser: any;

	loadQsubtype: any;

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private qbankService: QbankService,
		private adminService: AdminService,
		private htt: HtmlToTextService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private commonAPIService: CommonAPIService,
		private userAccessMenuService: UserAccessMenuService,
		public dialogRef: MatDialogRef<EditSubjectiveDialog>,
		private sanitizer: DomSanitizer,
		private changeDetectionRef: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ckeConfig: any;
	@ViewChild('question') ckeditor: any;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild('explanationckeditor') explanationckeditor: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	SUBJECTIVE_ELEMENT_DATA: SubjectiveElement[] = [];
	subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
	subjectivedisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'details', 'action'];


	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getQuestionSubtypeDataByQuestiontype();
		this.getBoard();
		this.getClass();
		this.getSchool();
		this.getQuestionTypeData();
		this.getSkillData();
		this.getLodData();
		this.setQuestion(this.data);
	}

	ngOnDestroy() {
		if (!this.changeDetectionRef['destroyed']) {
			this.changeDetectionRef.detectChanges();
		}
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	applyFilterSubjective(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); // Remove whitespace
		this.subjectivedataSource.filter = filterValue;

	}

	buildForm() {
		this.parameterform = this.fbuild.group({
			qst_id: this.data.qst_id,
			class_id: this.data.class_id,
			sub_id: this.data.sub_id,
			topic_id: this.data.topic_id,
			st_id: this.data.st_id,
			from_date: this.data.from_date,
			to_date: this.data.to_date
		});
		this.ind_entry_form1 = this.fbuild.group({
			qus_board_id: '',
			qus_class_id: '',
			qus_sub_id: '',
			qus_topic_id: '',
			qus_st_id: '',
			qus_status: ''
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
		this.sub_entry_form3 = this.fbuild.group({
			qus_id: '',
			qus_name: '',
			qopt_answer: '',
			qus_explanation: '',
			answer: ''
		});
		this.ind_entry_form3 = this.fbuild.group({});
	}

	onNoClick(): void {
		this.dialogRef.close();


	}

	getQuestionSubtypeDataByQuestiontype() {
		this.commonAPIService.getQsubtype(1).subscribe(
			(result: any) => {
				if (result) {
					this.questionSubtypeArray = result;
				}
			}
		);
	}

	getBoard(): void {
		this.qelementService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.boardArray = result.data;
				}
			}
		);
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
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
		this.qelementService.getSubtopicByTopic(topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				} else {
					this.subtopicArray = [];
				}
			}
		);
	}
	getQuestionTypeData(): void {
		this.commonAPIService.getQtype().subscribe(
			(result: any) => {
				if (result) {
					this.questionTypeArray = result;
				}
			}
		);
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

	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				}
			}
		);
	}
	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				}
			}
		);
	}

	setQuestion(question: any) {
		this.ind_entry_form1.setValue({
			'qus_board_id': this.data.question.qus_board_id,
			'qus_class_id': this.data.question.qus_class_id,
			'qus_sub_id': this.data.question.qus_sub_id,
			'qus_topic_id': this.data.question.qus_topic_id,
			'qus_st_id': this.data.question.qus_st_id,
			'qus_status': this.data.question.qus_status

		});
		this.ind_entry_form2.setValue({
			'qus_qt_id': this.data.question.qus_qt_id,
			'qus_qst_id': this.data.question.qus_qst_id,
			'qus_skill_id': this.data.question.qus_skill_id,
			'qus_dl_id': this.data.question.qus_dl_id,
			'qus_marks': Number(this.data.question.qus_marks),
			'qus_negative_marks': Number(this.data.question.qus_negative_marks),
			'qus_time_alloted': Number(this.data.question.qus_time_alloted),
			'qus_historical_reference': this.data.question.qus_historical_reference
		});
		this.sub_entry_form3.patchValue({
			'qus_id': this.data.question.qus_id,
			'qus_name': this.data.question.qus_name,
			'qopt_answer': this.data.question.qopt_answer,
			'qus_explanation': this.data.question.qus_explanation,
			'answer': this.data.question.answer
		});
		this.getSubjectsByClass();
		this.getTopicByClassSubject();
		this.getSubtopicByTopic();
	}
	closeDialog() {
		this.dialogRef.close();

	}

	getQuestionsReviewSub() {
		this.SUBJECTIVE_ELEMENT_DATA = [];
		this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
		this.questionsArray = [];
		let param: any = {};
		param = this.parameterform.value;
		if (Number(this.currentUser.role_id) === 1) {
			param.status = 3;
		} else {
			param.status = 0;
		}
		this.qelementService.getQuestionsInTemplate(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionsArray = result.data;
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
						this.SUBJECTIVE_ELEMENT_DATA.push({
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
						this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
						this.subjectivedataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.subjectivedataSource.sort = this.sort;
					}
				} else {
					this.tableCollection = false;
					this.notif.showSuccessErrorMessage('No records found', 'error');
				}
			}
		);
		if (!this.parameterform.value.qst_id) {
			this.tableCollection = false;

		} else {
			this.tableCollection = true;
		}

	}

	updateQuestionEditDialog() {
		const subQtype = this.data.listtemp;
		// tslint:disable-next-line:triple-equals
		if (subQtype == 6 || subQtype == 7 || subQtype == 8 || subQtype == 9 || subQtype == 10 || subQtype || subQtype == 12) {
			let answer: any;
			if (this.sub_entry_form3.value.qopt_answer) {
				answer = {
					'qopt_answer': this.sub_entry_form3.value.qopt_answer
				};
			}
			this.sub_entry_form3.patchValue({
				'answer': answer,

			});

			this.ind_entry_form3 = this.sub_entry_form3;
		}
		const resultobj = {};
		const jsonobj1 = JSON.parse(JSON.stringify(this.ind_entry_form1.value));
		const jsonobj2 = JSON.parse(JSON.stringify(this.ind_entry_form2.value));
		const jsonobj3 = JSON.parse(JSON.stringify(this.sub_entry_form3.value));
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
		if (Number(this.currentUser.role_id) !== 1) {
			resultobj['qus_status'] = '0';
		}
		if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.sub_entry_form3.valid) {
			this.qbankService.updateQuestion(resultobj)
				.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Question updated successfully', 'success');


					} else {
						this.notif.showSuccessErrorMessage('Error updating the question', 'error');
					}
				}
				);
		} else {
			this.notif.showSuccessErrorMessage('Error updating the question', 'error');
		}
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);

	deleteComCancel() { }

	parseData(data) {
		const updateddata = data.replace('\\', '\\\\');
		return updateddata;
	}
}



