import { Component, OnInit, TemplateRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserAccessMenuService, BreadCrumbService, NotificationService } from '../../../_services/index';

@Component({
	selector: 'app-generic-template-view-print',
	templateUrl: './generic-template-view-print.component.html',
	styleUrls: ['./generic-template-view-print.component.css']
})
export class GenericTemplateViewPrintComponent implements OnInit {

	modalRef2: BsModalRef;
	modalForm: FormGroup;
	public templateArray: any[];
	loading = false;
	printTemplate: any = {};
	homeUrl: string;
	ReasonArray = ['This is a duplicate question', 'This question is out of course', 'Reason 1', 'Reason 2', 'Reason 3'];
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;
	public tp_unpublish_remark: any;
	public tp_unpublish_other: any;
	public currentUnpublishedQues: any = {};

	displayedColumns = ['position', 'name', 'marks', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	dialog: any;

	constructor(
		private modalService: BsModalService,
		private fb: FormBuilder,
		private qelementService: QelementService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialogRef: MatDialogRef<GenericTemplateViewPrintComponent>,
		@Inject(MAT_DIALOG_DATA) private data,
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getGenericList();
		this.buildForm();
	}

	openDialog(item): void {
		const dialogRef = this.dialog.open(GenericTemplateViewPrintComponent, {
			width: '850px',
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


	buildForm() {
		this.modalForm = this.fb.group({
			tp_unpublish_remark: '',
			tp_unpublish_other: '',
		});
	}
	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	getGenericList() {
		this.templateArray = [];
		this.ELEMENT_DATA = [];
		const tt_id = 2;
		const tp_status = 1;
		this.loading = true;
		this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.templateArray = result.data;
					this.printTemplate = this.data.item;
				}

			}
		);
	}

	unpublishTemplate(tp_id) {
		this.loading = true;
		this.templateArray = [];
		this.tp_unpublish_remark = this.modalForm.value.tp_unpublish_remark;
		this.qelementService.publishUnpublishTemplate(tp_id, 0, this.tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question unpublished successfully', 'success');
					this.getGenericList();
				}

			}
		);
	}

	updateTemplate(value) {
		this.loading = true;
		this.qelementService.updateTemplate(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getGenericList();
				}
			}
		);
	}

	viewTemplate(item) {
		this.printTemplate = item;
	}

	getNameById(arr, id, idvalue, name) {
		for (const item of arr) {
			if (item[id] === idvalue) {
				return item[name];
			}
		}
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
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() { }
	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, { class: 'second' });
	}

}
