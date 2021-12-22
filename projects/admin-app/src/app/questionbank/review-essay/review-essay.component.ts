import { Component, OnInit, ViewChild, TemplateRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QbankService } from '../service/qbank.service';
import { QelementService } from '../service/qelement.service';
import {AdminService} from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { BreadCrumbService, HtmlToTextService, NotificationService, UserAccessMenuService } from 'projects/axiom/src/app/_services/index';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, Sort, PageEvent } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ReviewElement} from './review-essay.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EssayDialogsComponent } from '../essay-dialogs/essay-dialogs.component';
import { EditEssayComponent } from './edit-essay/edit-essay.component';

@Component({
	selector: 'app-review-essay',
	templateUrl: './review-essay.component.html',
	styleUrls: ['./review-essay.component.css']
})
export class ReviewEssayComponent implements OnInit, AfterViewChecked, AfterViewInit {
		modalRef2: BsModalRef;
		modalRef: BsModalRef;
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
		currentQues: any[];
		ReasonArray = ['This is a duplicate question', 'This question is out of course', 'Reason 1', 'Reason 2', 'Reason 3'];
		public listtemp: number;
		public optionHA = ['A', 'B', 'C', 'D', 'E'];
		public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
		homeUrl: string;
		public qus_unpublish_remark: any;
		public currentUnpublishedQues: any = {};
		tableCollectionSub: Boolean = false;
		tableCollectionMCQ: Boolean = false;
		tableCollectionMULTIMCQ: Boolean = false;
		tableCollectionTF: Boolean = false;
		tableCollectionMatch: Boolean = false;
		tableCollectionMatrix: Boolean = false;
		tableCollection = false;
		answerReview = '';
		enableOptionAnswer = false;
		enableOptionMtfAnswer = false;
		sortedData: any;
		essayDialogRef: MatDialogRef<EssayDialogsComponent>;
		@ViewChild('paginator') paginator: MatPaginator;
		@ViewChild(MatSort) sort: MatSort;
		@ViewChild('deleteModalRef') deleteModalRef;
		REVIEW_ELEMENT_DATA: ReviewElement[] = [];
		reviewdisplayedColumns = ['position', 'question', 'answer', 'explanations', 'class', 'topic', 'subtopic', 'details', 'reasons', 'action'];
		reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		currentUser: any;
		reasonsArray: any[] = [];
		modalForm: FormGroup;
		reason_id: any;
	constructor(
		private modalService: BsModalService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private qbankService: QbankService,
		private adminService: AdminService,
		private htt: HtmlToTextService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private userAccessMenuService: UserAccessMenuService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getClass();
		this.getPublishUnpublishReasons();
	}
	buildForm() {
		this.parameterform = this.fbuild.group({
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
ngAfterViewInit() {
		this.reviewdatasource.paginator = this.paginator;
		this.reviewdatasource.sort = this.sort;
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
		if (this.parameterform.value.ess_id) {
		this.questionsArray = [];
		let param: any = {};
		param = this.parameterform.value;
		if (Number(this.currentUser.role_id) === 1) {
		param.status = 3;
		} else {
				param.status = 0;
		}
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
													if ((Number(t.qus_qst_id) > 5 && Number(t.qus_qst_id) < 13)) {
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
													+ '<span>Lod:&nbsp;&nbsp' + t.dl_name + '</span><br>'
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
														reasons: reasons,
														showHover: hoverArray[ind - 1],
														action: t
												});
												ind++;
												}
												this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
												setTimeout(() => this.reviewdatasource.paginator = this.paginator);
												this.questionlistFlag = true;
												setTimeout(() => this.getHover(), 2000);

										} else {
												this.questionlistFlag = false;
												this.notif.showSuccessErrorMessage('No Records Found', 'error');
										}
								});
		} else {
				this.notif.showSuccessErrorMessage('Please Select Essay', 'error');
		}

	}

	getHover() {
			for (const item of this.REVIEW_ELEMENT_DATA) {
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
			}
	}
	resetquestion() {
		this.parameterform.patchValue({
				'topic_id' : '',
				'st_id' : '',
				'sub_id' : '',
				'class_id' : '',
				'ess_id': ''
		});
		this.questionlistFlag = false;
	}
	applyFilterEssay(filterValue: string) {
		this.reviewdatasource.filter = filterValue.trim().toLowerCase();
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
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
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);

	deleteComCancel() {  }
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
	openDialog(question) {
		const dialogRef = this.dialog.open(EditEssayComponent, {
				height: '90vh',
				data: { question: question, listtemp: question.qus_qst_id }
		});

		dialogRef.afterClosed().subscribe(result => {
				this.getQuestionsReview();
		});
}
unpublishQuestion(qus_id) {
		this.questionsArray = [];
		this.qus_unpublish_remark = this.modalForm.value.qus_unpublish_remark;
		this.reason_id = this.modalForm.value.reason_id;
		if (this.modalForm.valid) {
		this.qelementService.publishUnpublishQuestion(qus_id, 2, this.qus_unpublish_remark, this.reason_id, this.currentUser.login_id, '')
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
