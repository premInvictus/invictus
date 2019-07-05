import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../shared-module/customPaginatorClass';
import { InvoiceElement } from './invoice-element.model';
import { FeeLedgerElement } from './fee-ledger.model';
import { MatDialog } from '@angular/material';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ErpCommonService, CommonAPIService } from '../../../../../../src/app/_services/index';
import { FormBuilder } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';

@Component({
	selector: 'app-student-fee-detail',
	templateUrl: './student-fee-detail.component.html',
	styleUrls: ['./student-fee-detail.component.css'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class StudentFeeDetailComponent implements OnInit {
	invoiceArray: any;
	totalRecords: any;
	recordArray: any[] = [];
	lastRecordId: any;
	loginId: any;
	processType: any;
	orderMessage = '';
	footerRecord: any = {
		feeduetotal: 0,
		concessiontotal: 0,
		receipttotal: 0
	};
	userDetail: any;
	studentInvoiceData: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('table') table: ElementRef;
	@ViewChild('paymentOrderModel') paymentOrderModel;
	INVOICE_ELEMENT: InvoiceElement[] = [];
	FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];


	// tslint:disable-next-line: max-line-length
	displayedColumns: string[] = ['srno', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
	dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT);

	displayedLedgerColumns: string[] = ['srno', 'date', 'invoiceno', 'feeperiod', 'particular', 'amount', 'concession', 'reciept', 'balance'];

	ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);

	pageIndex = 0;
	invoicepagesize = 10;
	invoicepagesizeoptions = [10, 25, 50, 100];
	outStandingAmt = 0;

	constructor(
		public dialog: MatDialog,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService,
		public erpCommonService: ErpCommonService,
		public qelementService: QelementService,
		private route: ActivatedRoute,
		private router: Router,
	) { }

	ngOnInit() {

		this.invoiceArray = [];
		this.INVOICE_ELEMENT = [];
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT);

		this.recordArray = [];
		this.FEE_LEDGER_ELEMENT = [];
		this.ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);

		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.loginId = currentUser.login_id;
		this.processType = currentUser.au_process_type;
		this.getStudentInvoiceDetail();
		this.getStudentFeeOutstanding();
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}


	getStudentInvoiceDetail() {
		this.invoiceArray = [];
		const inputJson = {
			'processType': this.processType,
			// 'inv_process_usr_no': this.loginId,
			'pageIndex': this.pageIndex,
			'pageSize': this.invoicepagesize
		};
		this.erpCommonService.getInvoice(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceArray = result.data.invoiceData;
				this.totalRecords = Number(result.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.invoiceTableData(this.invoiceArray);
			} else {
				this.invoiceTableData();
			}
		});
	}

	fetchData(event?: PageEvent) {
		this.pageIndex = event.pageIndex;
		this.invoicepagesize = event.pageSize;
		this.getStudentInvoiceDetail();
		return event;
	}

	getStudentFeeLedgerDetail() {
		let element: any = {};
		this.FEE_LEDGER_ELEMENT = [];
		this.ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		// tslint:disable-next-line: max-line-length
		this.erpCommonService.getFeeLedger({ login_id: this.loginId, inv_process_type: this.processType }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.recordArray = [];
				this.FEE_LEDGER_ELEMENT = [];
				this.ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				let pos = 1;
				this.footerRecord = {
					feeduetotal: 0,
					concessiontotal: 0,
					receipttotal: 0
				};
				this.recordArray = result.data;
				for (const item of this.recordArray) {
					element = {
						srno: pos,
						date: new DatePipe('en-in').transform(item.flgr_created_date, 'd-MMM-y'),
						invoiceno: item.flgr_invoice_receipt_no ? item.flgr_invoice_receipt_no : '-',
						feeperiod: item.flgr_fp_months ? item.flgr_fp_months : '-',
						particular: item.flgr_particulars ? item.flgr_particulars : '-',
						amount: item.flgr_amount ? item.flgr_amount : '0',
						concession: item.flgr_concession ? item.flgr_concession : '0',
						reciept: item.flgr_receipt ? item.flgr_receipt : '0',
						balance: item.flgr_balance ? item.flgr_balance : '0',
						action: item
					};
					this.FEE_LEDGER_ELEMENT.push(element);
					pos++;
					this.footerRecord.feeduetotal += Number(element.amount);
					this.footerRecord.concessiontotal += Number(element.concession);
					this.footerRecord.receipttotal += Number(element.reciept);
				}
				this.ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			}
		});
	}

	invoiceTableData(invoicearr = []) {
		this.INVOICE_ELEMENT = [];
		invoicearr.forEach((element, index) => {
			let status = '';
			let statusColor = '';
			if (element.inv_activity) {
				status = element.inv_activity;
			} else {
				status = element.inv_paid_status;
			}
			if (element.inv_activity) {
				if (element.inv_activity === 'consolidated') {
					statusColor = '#ec398e';
				} else if (element.inv_activity === 'modified') {
					statusColor = '#0e7d9e';
				} else if (element.inv_activity === 'recalculated') {
					statusColor = '#ff962e';
				}
			} else {
				if (element.inv_paid_status === 'paid') {
					statusColor = 'green';
				} else {
					statusColor = 'red';
				}
			}

			this.INVOICE_ELEMENT.push({
				srno: (index + 1),
				invoiceno: element.inv_invoice_no,
				inv_id: element.inv_id,
				feeperiod: element.fp_name,
				invoicedate: element.inv_invoice_date,
				duedate: element.inv_due_date,
				feedue: element.inv_fee_amount,
				remark: element.inv_remark,
				status: status,
				statuscolor: statusColor,
				selectionDisable: status === 'paid' ? true : false,
				action: element
			});

		});
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.dataSource.sort = this.sort;
		if (this.dataSource && this.dataSource.paginator) {
			this.dataSource.paginator.length = this.paginator.length = this.totalRecords;
			this.dataSource.paginator = this.paginator;
		}

	}

	changeTab($event) {
		if (Number($event.index) === 0) {
			this.getStudentInvoiceDetail();
			this.getStudentFeeOutstanding();
		} else {
			this.getStudentFeeLedgerDetail();
		}
	}

	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('fee_ledger')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'FeeLedger_' + this.loginId + '_' + (new Date).getTime() + '.xlsx');

	}

	downloadInvoice(inv_id) {
		this.erpCommonService.downloadInvoice({ inv_id: [inv_id] }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}

	getStudentFeeOutstanding() {
		const inputJson = {
			inv_process_type: this.processType,
			// inv_login_id: this.loginId
			inv_login_id: 1678
		};

		this.erpCommonService.getStudentFeeOutstanding(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentInvoiceData = result.data[0];
				// tslint:disable-next-line: max-line-length
				this.outStandingAmt = Number(this.studentInvoiceData['inv_fee_amount']) + Number(this.studentInvoiceData['inv_fine_amount']) + Number(this.studentInvoiceData['inv_opening_balance']);
			} else {
				this.outStandingAmt = 0;
			}
		});
	}

	orderPayment($event) {
		this.orderMessage = 'Are you confirm to make payment?  Your Pyament is : <b>' + this.outStandingAmt + '</b>';
		this.paymentOrderModel.openModal(this.outStandingAmt);
	}

	makePayment($event) {
		console.log('Do Payment');
		const inputJson = {
			// invoice_ids: this.studentInvoiceData['inv_ids'],
			// inv_login_id: this.loginId,
			inv_login_id: 1678,
			inv_process_type: this.processType,
			out_standing_amt: this.outStandingAmt
		};

		this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.paymentOrderModel.closeDialog();
			} else {
				this.paymentOrderModel.closeDialog();
			}
		});
	}

}
