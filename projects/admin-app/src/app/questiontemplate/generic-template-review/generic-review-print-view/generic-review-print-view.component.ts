import { Component, OnInit, Inject } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UserAccessMenuService, BreadCrumbService, NotificationService } from '../../../_services/index';
import { Element } from '../generic-template-review.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-generic-review-print-view',
	templateUrl: './generic-review-print-view.component.html',
	styleUrls: ['./generic-review-print-view.component.css']
})
export class GenericReviewPrintViewComponent implements OnInit {
	public templateArray: any[];
	currentQues: any[];
	printTemplate: any = {};

	constructor(
		private qelementService: QelementService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<GenericReviewPrintViewComponent>,
		@Inject(MAT_DIALOG_DATA) private data
	) { }

	ngOnInit() {
		this.getGenericList();
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

	getGenericList() {
		const tt_id = '2';
		const tp_status = '0';
		this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.templateArray = result.data;
					this.printTemplate = this.data.item;
				}

			}
		);
	}

	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}

	viewTemplate(item) {
		this.printTemplate = item;
	}

	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button { display:none; } </style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}

}
