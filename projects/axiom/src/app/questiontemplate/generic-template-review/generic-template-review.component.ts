import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UserAccessMenuService, BreadCrumbService, NotificationService } from '../../_services/index';
import { Element } from './generic-template-review.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenericReviewPrintViewComponent } from './generic-review-print-view/generic-review-print-view.component';

@Component({
	selector: 'app-generic-template-review',
	templateUrl: './generic-template-review.component.html',
	styleUrls: ['./generic-template-review.component.css']
})
export class GenericTemplateReviewComponent implements OnInit {

	public templateArray: any[];
	currentQues: any[];
	printTemplate: any = {};
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	displayedColumns = ['position', 'name', 'marks', 'time', 'reasons', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);


	constructor(
		private qelementService: QelementService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getGenericList();
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
		const tt_id = '2';
		const tp_status = '0';
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.templateArray = result.data;
					let ind = 1;
					for (const t of this.templateArray) {
						let reasons = '';
						if (t.tp_unpublish_reason_desc) {
							reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.tp_unpublish_reason_desc + '</span><br>'
								+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
								+ '<span>Unpublisher:&nbsp;&nbsp' + t.tp_unpublish_by_user_name + '</span>';
						} else {
							reasons = 'Not Applicable';
						}
						this.ELEMENT_DATA.push({
							position: ind,
							name: t.tp_name,
							marks: t.tp_marks,
							time: t.tp_time_alloted,
							reasons: reasons,
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

	openDialog(item): void {
		const dialogRef = this.dialog.open(GenericReviewPrintViewComponent, {
			width: '850px',
			data: {
				item: item
				// 'tp_class_id': this.filterform.value.tp_class_id,
				// 'tp_sub_id': this.filterform.value.tp_sub_id,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}
	publishTemplate(tp_id) {

		const tp_unpublish_remark = '';
		this.qelementService.publishUnpublishTemplate(tp_id, 1, tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question Published Successfully', 'success');
					this.getGenericList();
				}
			}
		);
	}

	unpublishTemplate(tp_id, tp_status, tp_unpublish_remark) {

		this.qelementService.publishUnpublishTemplate(tp_id, 0, tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getGenericList();
				}
			}
		);
	}
	updateTemplate(value) {

		this.qelementService.updateTemplate(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getGenericList();
				}

			}
		);
	}
	deleteTemp(value) {
		for (const item of this.templateArray) {
			if (value === item.tp_id) {
				this.currentQues = item.tp_id;
			}
		}
	}

	deleteTemplate(currentQues) {
		this.qelementService.deleteTemplate(currentQues).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getGenericList();
					this.notif.showSuccessErrorMessage('Question Deleted Successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Deletion Failed', 'error');
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
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() { }
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

