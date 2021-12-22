import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserAccessMenuService, BreadCrumbService, NotificationService } from '../../_services/index';
import { Element } from './generic-template-list.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericTemplateViewPrintComponent } from './generic-template-view-print/generic-template-view-print.component';

@Component({
	selector: 'app-generic-template-list',
	templateUrl: './generic-template-list.component.html',
	styleUrls: ['./generic-template-list.component.css']
})
export class GenericTemplateListComponent implements OnInit {
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
	reasonsArray: any[] = [];
	reason_id: any;
	currentUser: any;

	displayedColumns = ['position', 'name', 'marks', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	dialogRef: any;
	modalRef: BsModalRef;

	constructor(
		private modalService: BsModalService,
		private fb: FormBuilder,
		private qelementService: QelementService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getGenericList();
		this.buildForm();
		this.getPublishUnpublishReasons();
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


	buildForm() {
		this.modalForm = this.fb.group({
			tp_unpublish_remark: ['', Validators.required],
			reason_id: ['', Validators.required],
		});
	}
	getPublishUnpublishReasons() {
		this.qelementService.publishUnpublishReason({ reason_type: 3 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonsArray = result.data;
			}
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
					let ind = 1;
					for (const t of this.templateArray) {
						this.ELEMENT_DATA.push({
							position: ind,
							name: t.tp_name,
							marks: t.tp_marks,
							time: t.tp_time_alloted,
							action: t
						});
						ind++;
					}
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
					this.dataSource.sort = this.sort;
				}

			}
		);
	}

	unpublishTemplate(tp_id) {
		this.loading = true;
		this.templateArray = [];
		this.tp_unpublish_remark = this.modalForm.value.tp_unpublish_remark;
		this.reason_id = this.modalForm.value.reason_id;
		if (this.modalForm.valid) {
			this.qelementService.publishUnpublishTemplate(tp_id, 0, this.tp_unpublish_remark, this.reason_id, this.currentUser.login_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.modalRef2.hide();
						this.getGenericList();
						this.notif.showSuccessErrorMessage('Question Template unpublished successfully', 'success');
					}

				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please select Reasons and enter remarks', 'error');
		}
	}
	getCurrentUnpublishedQues(item) {
		this.currentUnpublishedQues = item;
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

	closeDialog(): void {
		this.dialogRef.close();
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

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}
	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, { class: 'modal-sm', backdrop: 'static' });
	}
}

