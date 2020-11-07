import { Component, OnInit, Inject } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HtmlToTextService, NotificationService, BreadCrumbService } from '../../../_services';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-ques-paper-review-view',
	templateUrl: './ques-paper-review-view.component.html',
	styleUrls: ['./ques-paper-review-view.component.css']
})
export class QuesPaperReviewViewComponent implements OnInit {

	modalRef: BsModalRef;
	parameterform: FormGroup;
	homeUrl: string;
	classArray: any[];
	currentQues: any[];
	subjectArray: any[] = [];
	qpaperArray: any[];
	questionArray: any[];
	viewCurrentQP: any;
	public qp_unpublish_remark: any;
	viewCurrentQPFlag = false;
	filterArray: any[];
	filterQuestionList: any[] = [];
	subjectArrayInCurrentPaperDetails: any[] = [];
	tableCollection = false;
	replaceQusCount = 0;
	deleteModalRef: any;
	sno = 0;


	constructor(
		private qelementService: QelementService,
		private fb: FormBuilder,
		private htt: HtmlToTextService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<QuesPaperReviewViewComponent>,
		private sanitizer: DomSanitizer,
		@Inject(MAT_DIALOG_DATA) private data
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getSubjectsByClass(this.data.item.qp_class_id);
		this.viewQuestionPaper(this.data);
		// this.getQuestionPaper();
	}

	openDialog(item): void {
		const dialogRef = this.dialog.open(QuesPaperReviewViewComponent, {
			width: '850px',
			height: '90vh',
			data: {
				item: item
			}
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
	}
	isExistUserAccessMenu(mod_id) {
	}

	buildForm() {
		this.parameterform = this.fb.group({
			qp_class_id: '',
			qp_sub_id: '',
			from_date: '',
			to_date: ''
		});
	}

	getSubjectsByClass(class_id): void {
		this.qelementService.getSubjectsByClass(class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}

			}
		);
	}



	deletePaper(value) {
		for (const item of this.qpaperArray) {
			if (value === item.qp_id) {
				this.currentQues = item.qp_id;
			}
		}
	}

	deleteQuestionPaper(currentQues) {
		this.qelementService.deleteQuestionPaper({ qp_id: currentQues }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQuestionPaper();
					this.notif.showSuccessErrorMessage('Test deleted successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Error deleting the test', 'error');
				}
			}
		);
	}

	publishQuestionPaper(qp_id) {
		// tslint:disable-next-line:prefer-const
		let qp_unpublish_remark;
		this.qelementService.publishUnpublishQuestionPaper(qp_id, 1, qp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Test published successfully', 'success');
					this.getQuestionPaper();
				}
			}
		);
	}
	getSubName(sub_id) {
		for (const element of this.subjectArray) {
			if (Number(element.sub_id) === Number(sub_id)) {
				return element.sub_name;
			}
		}
		return '';
	}

	viewQuestionPaper(item) {
		this.viewCurrentQP = this.data.item;
		console.log(this.viewCurrentQP);
		// this.viewCurrentQP.qp_sub_id=([this.viewCurrentQP.qp_sub_id]);
		const questionIdArray = [];
		this.filterArray = [];
		this.filterQuestionList = [];
		for (const qitem of this.data.item.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionArray = result.data;
					this.qelementService.getTemplate({ tp_id: this.data.item.qp_tp_id, tp_tt_id: this.data.item.tp_tt_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								const templateArray = result.data;
								let i = 0;
								// tslint:disable-next-line:no-shadowed-variable
								for (const item of templateArray) {
									if (item.tp_id === this.data.item.qp_tp_id) {
										break;
									} else {
										i++;
									}
								}
								this.filterArray = result.data[i].filters;
								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];
									for (const qitem of this.data.item.qlist) {
										if (filter.tf_id === qitem.qpq_tf_id) {
											// tslint:disable-next-line:no-shadowed-variable
											filterQuestionArray.push(this.questionArray[this.questionArray.findIndex(function (ques, i) {
												return ques.qus_id === qitem.qpq_qus_id;
											})
											]);
										}
									}
									filter.qlist = filterQuestionArray;
									this.filterQuestionList.push(filter);
								}
								console.log(this.filterQuestionList);
								const subjectArrayInCurrentPaper = this.viewCurrentQP.qp_sub_id.replace(/\s/g, '').split(',');
								if (subjectArrayInCurrentPaper.length > 0) {
									for (const sub of subjectArrayInCurrentPaper) {
										this.subjectArrayInCurrentPaperDetails.push({
											sub_id: sub,
											sub_name: this.getSubName(sub)
										});
									}
								}
								console.log(this.subjectArrayInCurrentPaperDetails);
								this.manipulateData();
							}
						}
					);
					this.viewCurrentQPFlag = true;
				}
			}
		);
	}
	getQusPosFromCurrentQP(qus_id) {
		for (const qus of this.viewCurrentQP.qlist) {
			if (qus.qpq_qus_id === qus_id) {
				return qus.qpq_qus_position;
			}
		}
	}
	manipulateData() {
		for (const item of this.filterQuestionList) {
			if (item.qlist[0]) {
				for (const qitem of item.qlist) {
					for (const qpitem of this.data.item.qlist) {
						if (qitem.qus_id === qpitem.qpq_qus_id) {
							qitem.qus_marks = qpitem.qpq_marks;
							break;
						} else {
							continue;
						}
					}
				}
			}
		}
	}
	getQuestionPaper() {
		// Form validations
		this.qpaperArray = [];

		const param: any = {};
		param.class_id = this.parameterform.value.qp_class_id;
		param.sub_id = this.parameterform.value.qp_sub_id;
		param.qp_status = '0';
		if (this.parameterform.valid) {
			this.qelementService.getQuestionPaper(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.qpaperArray = result.data;
					}
				});
		}
		if (!this.parameterform.value.qp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.parameterform.value.qp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		} else {
			this.tableCollection = true;
		}
	}
	replaceOneQuestion(qindex, findex) {
		let idindex = -1;
		const currentQus = this.filterQuestionList[findex].qlist[qindex];
		// tslint:disable-next-line:max-line-length
		this.qelementService.getQuestionsInTemplate({ qm_id: 1, qst_id: currentQus.qus_qst_id, st_id: currentQus.qus_st_id, skill_id: currentQus.qus_skill_id, dl_id: currentQus.qus_dl_id, qus_marks: currentQus.qus_marks, ess_id: currentQus.qus_ess_id, qus_limit: 1 }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const replacedQus = result.data[0];
					let replaceFlag = false;
					for (const fqus of this.filterQuestionList[findex].qlist) {
						if (fqus.qus_id === replacedQus.qus_id) {
							this.replaceQusCount++;
							replaceFlag = true;
							break;
						}
					}
					if (replaceFlag) {
						if (this.replaceQusCount < 4) {
							this.replaceOneQuestion(qindex, findex);
						} else {
							this.replaceQusCount = 0;
						}
					} else {
						this.replaceQusCount = 0;
						idindex = this.queIdExist(currentQus.qus_id);
						if (idindex !== -1) {
							this.viewCurrentQP.qlist[idindex].qpq_qus_id = replacedQus.qus_id;
							this.filterQuestionList[findex].qlist[qindex] = replacedQus;
						}
					}
				}
			}
		);
	}

	updateQuestionPaper() {
		this.qelementService.updateQuestionPaper(this.viewCurrentQP).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question updated successfully', 'success');
				}
			}
		);
	}

	queIdExist(qus_id) {
		let index = -1;
		for (const qus of this.viewCurrentQP.qlist) {
			index++;
			if (qus.qpq_qus_id === qus_id) {
				return index;
			}
		}
		return -1;
	}

	cancelQuestionPaper() {
		this.viewCurrentQPFlag = false;
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);

	deleteComCancel() { }

}
