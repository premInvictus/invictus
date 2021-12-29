import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { QbankService } from '../../../questionbank/service/qbank.service';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { NotificationService, BreadCrumbService, UserAccessMenuService } from '../../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
	selector: 'app-specific-template-view-print',
	templateUrl: './specific-template-view-print.component.html',
	styleUrls: ['./specific-template-view-print.component.css']
})
export class SpecificTemplateViewPrintComponent implements OnInit {

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

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	displayedColumns = ['position', 'test_name', 'class', 'subject', 'topic', 'mark', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private modalService: BsModalService,
		private fbuild: FormBuilder,
		private qbankDervice: QbankService,
		private qelementService: QelementService,
		private router: Router,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<SpecificTemplateViewPrintComponent>,
		@Inject(MAT_DIALOG_DATA) private data) { }


	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getClass();
		this.getSpecificList();
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
			tp_class_id: this.data.tp_class_id,
			tp_sub_id: this.data.tp_sub_id

		});
		this.modalForm = this.fbuild.group({
			tp_unpublish_remark: '',
			tp_unpublish_other: '',
		});
	}

	getCurrentUnpublishedQues(value) {
		this.currentUnpublishedQues = value;
	}

	getClass() {
		// Form validations
		if (!this.filterform.value.tp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.filterform.value.tp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
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

	closeDialog(): void {
		this.dialogRef.close();
	}

	getSpecificList() {
		// Form validations
		this.templateArray = [];
		this.ELEMENT_DATA = [];
		const tt_id = 1;
		const tp_status = 1;
		const tp_id = this.filterform.value.tp_id;
		if (this.filterform.valid) {
			// tslint:disable-next-line:max-line-length
			this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status, class_id: this.filterform.value.tp_class_id, sub_id: this.filterform.value.tp_sub_id }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.templateArray = result.data;
						this.printTemplate = this.data.item;
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
		this.qelementService.publishUnpublishTemplate(tp_id, 0, tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question unpublished successfully', 'success');
					this.getSpecificList();
				} else {
					this.notif.showSuccessErrorMessage('Error unpublishing the question', 'error');
				}
			}
		);
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
		this.modalRef2 = this.modalService.show(template, { class: 'second' });
	}

	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button { display:none; } </style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}

	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}

}

export interface Element {
	test_name: string;
	position: number;
	class: string;
	section: string;
	subject: string;
	topic: string;
	mark: string;
	time: string;
	action: any;
}

