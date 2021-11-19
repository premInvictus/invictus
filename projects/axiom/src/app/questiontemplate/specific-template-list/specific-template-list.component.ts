import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, BreadCrumbService, UserAccessMenuService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Element } from './specificelement.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SpecificTemplateViewPrintComponent } from './specific-template-view-print/specific-template-view-print.component';

@Component({
	selector: 'app-specific-template-list',
	templateUrl: './specific-template-list.component.html',
	styleUrls: ['./specific-template-list.component.css']
})
export class SpecificTemplateListComponent implements OnInit {

	filterform: FormGroup;
	modalRef: BsModalRef;
	modalRef2: BsModalRef;
	modalForm: FormGroup;
	classArray: any[];
	subjectArray: any[];
	currentQues: any[];
	templateArray: any[] = [];
	printTemplate: any = {};
	ReasonArray: any[] = ['This is a duplicate question', 'This question is out of course', 'Reason 1', 'Reason 2', 'Reason 3'];
	homeUrl: string;
	public currentUnpublishedQues: any = {};
	public tp_unpublish_remark: any;
	public tp_unpublish_other: any;
	tableCollection: Boolean = false;
	currentUser: any = {};
	ELEMENT_DATA: Element[] = [];
	reasonsArray: any[] = [];
	reason_id: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	displayedColumns = ['position', 'test_name', 'class', 'subject', 'topic', 'mark', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	dialogRef: any;

	constructor(
		private modalService: BsModalService,
		private fbuild: FormBuilder,
		private qbankDervice: QbankService,
		private qelementService: QelementService,
		private router: Router,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getClass();
		this.getPublishUnpublishReasons();
	}

	openDialog(item): void {
		const dialogRef = this.dialog.open(SpecificTemplateViewPrintComponent, {
			width: '850px',
			data: {
				item: item,
				'tp_class_id': this.filterform.value.tp_class_id,
				'tp_sub_id': this.filterform.value.tp_sub_id,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.filterform = this.fbuild.group({
			tp_class_id: '',
			tp_sub_id: '',
			tp_id: '',
		});
		this.modalForm = this.fbuild.group({
			tp_unpublish_remark: ['', Validators.required],
			reason_id: ['', Validators.required]
		});
	}
	getPublishUnpublishReasons() {
		this.qelementService.publishUnpublishReason({ reason_type: 3 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonsArray = result.data;
			}
		});
	}

	getCurrentUnpublishedQues(value) {
		this.currentUnpublishedQues = value;
	}

	closeDialog() {
		this.dialogRef.close();
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
		this.qelementService.getSubjectsByClass(this.filterform.value.tp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
					this.notif.showSuccessErrorMessage('Subject is required', 'error');
				}
				this.filterform.patchValue({
					'tp_sub_id': '',
				});
			}
		);
	}

	getSpecificList() {
		// Form validations
		this.templateArray = [];
		this.ELEMENT_DATA = [];
		const tt_id = 1;
		const tp_status = 1;
		if (this.filterform.valid) {
			// tslint:disable-next-line:max-line-length
			this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status, class_id: this.filterform.value.tp_class_id, sub_id: this.filterform.value.tp_sub_id }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.templateArray = result.data;
						let ind = 1;
						let curTopic_name = '';
						let etopicArray = [];
						for (const t of this.templateArray) {
							etopicArray = [];
							for (const item of t.filters) {
								if (curTopic_name !== item.topic_name) {
									curTopic_name = item.topic_name;
									etopicArray.push({ topic_name: curTopic_name });
								}
							}
							let topic_name_list = '';
							for (const titem of etopicArray) {
								if (etopicArray.length > 1) {
									topic_name_list += ' ' + '<li>' + titem.topic_name + '</li>';
								} else {
									topic_name_list += ' ' + titem.topic_name;
								}
							}
							// tslint:disable-next-line:max-line-length
							this.ELEMENT_DATA.push({ position: ind, test_name: t.tp_name, class: t.class_name, section: t.sec_name, subject: t.sub_name, topic: topic_name_list, mark: t.tp_marks, time: t.tp_time_alloted, action: t });
							ind++;
							curTopic_name = '';
						}
						this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.dataSource.sort = this.sort;
					} else {
						this.tableCollection = false;
						this.notif.showSuccessErrorMessage('No record found', 'error');
					}
				},
			);
		}
		if (!this.filterform.value.tp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.filterform.value.tp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		} else {
			this.tableCollection = true;
		}
	}

	unpublishTemplate(tp_id) {
		// tslint:disable-next-line:prefer-const
		let tp_unpublish_remark;
		this.tp_unpublish_remark = this.modalForm.value.tp_unpublish_remark;
		this.reason_id = this.modalForm.value.reason_id;
		if (this.modalForm.valid) {
			this.qelementService.publishUnpublishTemplate(tp_id, 0, this.tp_unpublish_remark, this.reason_id, this.currentUser.login_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.modalRef2.hide();
						this.getSpecificList();
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

	updateTemplate(value) {
		this.qelementService.updateTemplate(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Updated successfully', 'success');
					this.getSpecificList();
				}
			}
		);
	}

	getNameById(arr, id, idvalue, name) {
		for (const item of arr) {
			if (item[id] === idvalue) {
				return item[name];
			}
		}
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}

	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, { class: 'modal-sm', backdrop: 'static' });
	}

	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button { display:none; } </style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	viewTemplate(item) {
		this.printTemplate = item;
	}
	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}
}
