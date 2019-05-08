import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeLedgerElement } from './fee-ledger.model';
import { SisService, ProcesstypeService, FeeService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
export interface PeriodicElement {
	srno: number;
	date: string;
	invoiceno: number;
	particular: string;
	amount: number;
	concession: number;
	reciept: number;
	balance: number;
}
@Component({
	selector: 'app-fee-ledger',
	templateUrl: './fee-ledger.component.html',
	styleUrls: ['./fee-ledger.component.scss']
})
export class FeeLedgerComponent implements OnInit {

	displayedColumns: string[] = ['srno', 'date', 'invoiceno', 'particular', 'amount', 'concession', 'reciept', 'balance'];
	FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];
	dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
	lastRecordId: any;
	loginId: any;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('table') table: ElementRef;
	constructor(private sisService: SisService,
		private feeService: FeeService,
		public processtypeService: ProcesstypeService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.processtypeService.setProcesstype('4');
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.lastRecordId = result.data[0].last_record;
				this.loginId = result.data[0].au_login_id;
				this.getFeeLedger(this.loginId);
			}
		});
	}
	getFeeLedger(login_id) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.feeService.getFeeLedger({ login_id: login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.FEE_LEDGER_ELEMENT.push({
						srno: pos,
						date: new DatePipe('en-in').transform(item.flgr_created_date, 'd-MMM-y'),
						invoiceno: item.flgr_invoice_receipt_no ? item.flgr_invoice_receipt_no : '-',
						particular: item.flgr_particulars ? item.flgr_particulars : '-',
						amount: item.flgr_amount ? item.flgr_amount : '-',
						concession: item.flgr_concession ? item.flgr_concession : '-',
						reciept: item.flgr_receipt ? item.flgr_receipt : '-',
						balance: item.flgr_balance ? item.flgr_balance : '-',
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			}
		});
	}
	next(admno) {
		this.loginId = admno;
		this.getFeeLedger(this.loginId);
	}
	prev(admno) {
		this.loginId = admno;
		this.getFeeLedger(this.loginId);
	}
	first(admno) {
		this.loginId = admno;
		this.getFeeLedger(this.loginId);
	}
	last(admno) {
		this.loginId = admno;
		this.getFeeLedger(this.loginId);
	}
	key(admno) {
		this.loginId = admno;
		this.getFeeLedger(this.loginId);
	}
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('fee_ledger')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'FeeLedger_' + this.loginId + '_' + (new Date).getTime() + '.xlsx');

	}
	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '100%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getFeeLedger(this.loginId);

		});
	}
	openReceiptDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '100%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit
			},
			hasBackdrop: false
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getFeeLedger(this.loginId);

		});
	}


}
