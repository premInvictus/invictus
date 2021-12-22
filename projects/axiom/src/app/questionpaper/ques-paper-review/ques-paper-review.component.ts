import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService, BreadCrumbService, HtmlToTextService, UserAccessMenuService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Element } from './Element.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuesPaperReviewViewComponent } from './ques-paper-review-view/ques-paper-review-view.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-ques-paper-review',
	templateUrl: './ques-paper-review.component.html',
	styleUrls: ['./ques-paper-review.component.css']
})

export class QuesPaperReviewComponent implements OnInit {

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
	tableCollection = false;
	replaceQusCount = 0;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;
	displayedColumns = ['position', 'name', 'class', 'subject', 'marks', 'reasons', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private qelementService: QelementService,
		private fb: FormBuilder,
		private htt: HtmlToTextService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog,
		public router:Router,
		public route:ActivatedRoute
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getClass();
		this.buildForm();
	}

	openDialog(item): void {
		console.log('item',item);
		if(item.qp_qm_id == 3){
			this.router.navigate(['../../question_paper_setup/express_paper_setup'], { queryParams: { qp_id: item.qp_id }, relativeTo: this.route });
		} else {
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
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.parameterform = this.fb.group({
			qp_class_id: '',
			qp_sub_id: '',
			from_date: '',
			to_date: ''
		});
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

	getQuestionPaper() {
		// Form validations
		this.qpaperArray = [];
		this.ELEMENT_DATA = [];
		const param: any = {};
		param.class_id = this.parameterform.value.qp_class_id;
		param.sub_id = this.parameterform.value.qp_sub_id;
		param.qp_status = ['0','2'];
		if (this.parameterform.valid) {
			this.qelementService.getQuestionPaper(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.qpaperArray = result.data;
						let ind = 1;
						for (const t of this.qpaperArray) {
							// tslint:disable-next-line:max-line-length
							let reasons = '';
							if (t.qp_unpublish_reason_desc) {
								reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.qp_unpublish_reason_desc + '</span><br>'
									+ '<span>Remark:&nbsp;&nbsp' + t.qp_unpublish_remark + '</span><br>'
									+ '<span>Unpublisher:&nbsp;&nbsp' + t.qp_unpublish_by_user_name + '</span>';
							} else {
								reasons = 'Not Applicable';
							}
							let sec: any;
							if (t.sec_name) {
								sec = '-' + t.sec_name;
							} else {
								sec = '';
							}
							this.ELEMENT_DATA.push({
								position: ind,
								name: t.qp_name,
								class: t.class_name + sec,
								section: t.sec_name,
								subject: t.sub_name,
								marks: t.tp_marks,
								reasons: reasons,
								status: t.qp_status == '0' ? 'review' : 'draf',
								action: t
							});
							ind++;
						}
						this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.dataSource.sort = this.sort;
					} else {
						this.tableCollection = false;
						this.notif.showSuccessErrorMessage('No record found', 'error');
					}
				}
			);
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

	viewQuestionPaper(item) {
		this.viewCurrentQP = item;
		const questionIdArray = [];
		this.filterArray = [];
		this.filterQuestionList = [];
		for (const qitem of item.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionArray = result.data;
					this.qelementService.getTemplate({ tp_id: item.qp_tp_id, tp_tt_id: item.tp_tt_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								this.filterArray = result.data[0].filters;
								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];
									for (const qitem of item.qlist) {
										if (filter.tf_id === qitem.qpq_tf_id) {
											filterQuestionArray.push(this.questionArray[this.questionArray.findIndex(function (ques, i) {
												return ques.qus_id === qitem.qpq_qus_id;
											})
											]);
										}
									}
									filter.qlist = filterQuestionArray;
									this.filterQuestionList.push(filter);
								}
							}
						}
					);
					this.viewCurrentQPFlag = true;
				}
			}
		);
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


