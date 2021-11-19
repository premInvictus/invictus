import { ChangeDetectorRef, Component, OnInit, ViewChild, Injectable, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, BreadCrumbService, HtmlToTextService,
	UserAccessMenuService, CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SubjectiveElement } from './externalsubjectelement.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ckconfig } from '../../questionbank/ckeditorconfig';
import { MathJaxDirective } from './../../mathjax.directive';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { AcsetupService } from '../../acsetup/service/acsetup.service';
@Component({
	selector: 'app-externalreviewsubjective',
	templateUrl: './externalreviewsubjective.component.html',
	styleUrls: ['./externalreviewsubjective.component.css']
})
export class ExternalreviewsubjectiveComponent implements OnInit {

	public ind_entry_form1: FormGroup;
	public ind_entry_form2: FormGroup;
	public sub_entry_form3: FormGroup;
	public ind_entry_form3: FormGroup;
	public parameterform: FormGroup;
	public questionsArray: any[] = [];
	public questionTypeArray: any[];
	public questionSubtypeArray: any[];
	currentQues: any[];
	currentUser: any;
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
	username: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	SUBJECTIVE_ELEMENT_DATA: SubjectiveElement[] = [];
	subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
	subjectivedisplayedColumns = ['position', 'question', 'answer', 'class', 'topic', 'subtopic', 'skill', /* 'lod', */ 'reasons', 'action'];

	ckeConfig: any;
	stArray: any[] = [];
	allStArray: any[] = [];
	stArrayFinal: any[] = [];

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private qbankService: QbankService,
		private htt: HtmlToTextService,
		private commonAPIService: CommonAPIService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		public dialog: MatDialog,
		public sanitizer: DomSanitizer,
		private adminService: AdminService,
		private acSetupService: AcsetupService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getBoard();
		this.getClass();
		this.getSchool();
		// this.getQuestionTypeData();
		this.getSkillData();
		this.getLodData();
		this.getSubTopicAll();
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
	openDialog(question) {
		const dialogRef = this.dialog.open(EditSubjectiveDialogExternal, {
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

	getUserAccessSubject(): void {
		let class_id;
		if (this.parameterform.value.class_id) {
			class_id = this.parameterform.value.class_id;
		} else {
			class_id = this.ind_entry_form1.value.qus_class_id;
		}
		this.adminService.getUserAccessSubject({ login_id: this.currentUser.login_id, class_id: class_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
				this.parameterform.patchValue({
					'topic_id': '',
					'st_id': '',
					'sub_id': ''
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
		this.adminService.getUserAccessTopic({ login_id: this.currentUser.login_id, class_id: class_id, sub_id: sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
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
		if (isValidForm) {
			this.SUBJECTIVE_ELEMENT_DATA = [];
			this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
			this.questionsArray = [];
			let param: any = {};
			param = this.parameterform.value;
			if (Number(this.currentUser.role_id) === 1) {
				param.status = '2';
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
								subtopic: this.stArray,
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
							this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
							this.subjectivedataSource.paginator = this.paginator;
							this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
							this.subjectivedataSource.sort = this.sort;
						}
						for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
							this.stArray = [];
							this.stArray = this.getArrayofSubtopic(item.topic_id);
							item.subtopic = this.stArray;

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
		this.getUserAccessSubject();
		this.getUserAccessTopic();
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

	updateExtQuestion(value) {
		this.qbankService.updateQuestion(
			{
				qus_dl_id: value.qus_dl_id,
				qus_skill_id: value.qus_skill_id,
				qus_st_id: value.qus_st_id,
				qus_id: value.qus_id,
				qus_status: value.qus_status

			}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.qelementService.publishUnpublishQuestion(value.qus_id, '7', value.qus_unpublish_remark, '', '', 'external')
						.subscribe(
						(result2: any) => {
							if (result2) {
								this.getQuestionsReview();
								this.notif.showSuccessErrorMessage('Question published successfully', 'success');
							}
						}
						);
				}
			});
	}
	getLOD(id) {
		for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
			for (const lod of this.lodArray) {
				if (Number(lod.dl_id) === Number(item.action.qus_dl_id) && Number(item.qus_id) === Number(id)) {
					item.action.qus_dl_id = lod.dl_id;
					break;
				}
			}
		}
	}

	getSkill(id) {
		for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
			for (const skill of this.skillTypeArray) {
				if (Number(skill.skill_id) === Number(item.action.qus_skill_id) && Number(item.qus_id) === Number(id)) {
					item.action.qus_skill_id = skill.skill_id;
					break;
				}
			}
		}
	}
}


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'externaleditsubjective',
	templateUrl: './externaleditsubjective.html',
})

// tslint:disable-next-line:component-class-suffix
export class EditSubjectiveDialogExternal implements OnInit, OnDestroy {
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
	stArray: any[] = [];
	allStArray: any[] = [];
	stArrayFinal: any[] = [];

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
		public dialogRef: MatDialogRef<EditSubjectiveDialogExternal>,
		private sanitizer: DomSanitizer,
		private changeDetectionRef: ChangeDetectorRef,
		private acSetupService: AcsetupService,
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
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getQuestionSubtypeDataByQuestiontype();
		this.getBoard();
		this.getClass();
		this.getSchool();
		this.getQuestionTypeData();
		this.getSubTopicAll();
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
		console.log(this.data.question);
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
			param.status = '2';
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
							subtopic: this.stArray,
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
						this.subjectivedataSource = new MatTableDataSource<SubjectiveElement>(this.SUBJECTIVE_ELEMENT_DATA);
						this.subjectivedataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.subjectivedataSource.sort = this.sort;
					}
					for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
						this.stArray = [];
						this.stArray = this.getArrayofSubtopic(item.topic_id);
						item.subtopic = this.stArray;
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
		if (Number(this.currentUser.role_id) === 1) {
			resultobj['qus_status'] = '2';
		} else {
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

	getMatTooltipData($event, id) {
		for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
			for (const st of item.subtopic) {
				if (Number(st.st_id) === Number($event.value) && Number(item.qus_id) === Number(id)) {
					item.tooltip = st.st_name;
					item.action.qus_st_id = st.st_id;
					break;
				}
			}
		}
	}
	updateExtQuestion(value, publishstatus = '7') {
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
						(result3: any) => {
							if (result3) {
								this.getQuestionsReviewSub();
								this.notif.showSuccessErrorMessage('Question published successfully', 'success');
							}
						}
						);
				}
			});
	}
	getLOD(id) {
		for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
			for (const lod of this.lodArray) {
				if (Number(lod.dl_id) === Number(item.action.qus_dl_id) && Number(item.qus_id) === Number(id)) {
					item.action.qus_dl_id = lod.dl_id;
					break;
				}
			}
		}
	}

	getSkill(id) {
		for (const item of this.SUBJECTIVE_ELEMENT_DATA) {
			for (const skill of this.skillTypeArray) {
				if (Number(skill.skill_id) === Number(item.action.qus_skill_id) && Number(item.qus_id) === Number(id)) {
					item.action.qus_skill_id = skill.skill_id;
					break;
				}
			}
		}
	}
}
