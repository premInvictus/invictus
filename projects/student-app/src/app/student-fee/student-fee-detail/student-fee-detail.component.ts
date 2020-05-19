import { Component, OnDestroy, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
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
import { count } from 'rxjs/operators';
import { interval } from 'rxjs';
import { timer } from 'rxjs';
import { PaymentChooserComponent } from '../payment-chooser/payment-chooser.component';

@Component({
	selector: 'app-student-fee-detail',
	templateUrl: './student-fee-detail.component.html',
	styleUrls: ['./student-fee-detail.component.css'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class StudentFeeDetailComponent implements OnInit, OnDestroy {
	invoiceArray: any;
	@ViewChild('chooser') chooser;
	dialogRef: MatDialogRef<PaymentChooserComponent>;
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
	responseHtml = '';
	paytmResult: any = {};
	postURL = '';

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('table') table: ElementRef;
	@ViewChild('paymentOrderModel') paymentOrderModel;
	@ViewChild('paytmResponse', { read: ElementRef }) private paytmResponse: ElementRef;
	INVOICE_ELEMENT: InvoiceElement[] = [];
	FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];


	// tslint:disable-next-line: max-line-length
	displayedColumns: string[] = ['srno', 'invoiceno', 'feeperiod', 'invoicedate', 'duedate', 'feedue', 'status', 'action'];
	dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT);

	displayedLedgerColumns: string[] = ['srno', 'date', 'invoiceno', 'feeperiod', 'particular', 'amount', 'concession', 'reciept', 'balance'];

	ledgerDataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);

	pageIndex = 0;
	currentIndex = 0;
	invoicepagesize = 10;
	invoicepagesizeoptions = [10, 25, 50, 100];
	outStandingAmt = 0;
	payAPICall: any;
	unsubscribePayAPIStatus: any;
	paymentStatus = false;
	settings: any[] = [];
	settingArr7: any[] = [];
	counter = 0;
	constructor(
		public dialog: MatDialog,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService,
		public erpCommonService: ErpCommonService,
		public qelementService: QelementService,
		private route: ActivatedRoute,
		private router: Router,
		private renderer: Renderer2
	) { }

	ngOnInit() {
		this.getGlobalSetting();
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
	}

	ngAfterViewInit() {

		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	getGlobalSetting() {
		this.settingArr7 = [];
		this.erpCommonService.getGlobalSetting({ "gs_alias": "payment_banks" }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.settings = (result.data[0] && result.data[0]['gs_value']) ? JSON.parse(result.data[0] && result.data[0]['gs_value']) : [];
				console.log(this.settings);
				this.counter = 0;
				this.currentIndex = 0;
				if (this.settings && this.settings.length > 0) {
					let i = 0;
					for (const item of this.settings) {
						if (item.enabled === 'true') {
							this.settingArr7.push(item.bank_alias);
							this.counter++;
						}
						if (this.counter === 1) {
							this.currentIndex = i;
						}
						i++;
					}
				} else {
					this.counter = 0;
				}

			}
		});
	}


	getStudentInvoiceDetail() {
		this.invoiceArray = [];
		const inputJson = {
			'processType': this.processType,
			'inv_login_id': this.loginId,
			// 'inv_login_id': 1567,
			'pageIndex': this.pageIndex,
			'pageSize': this.invoicepagesize
		};
		this.erpCommonService.getStudentInvoice(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceArray = result.data;
				this.totalRecords = Number(result.data.totalRecords);
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
			status = element.inv_paid_status;

			if (element.inv_paid_status === 'paid') {
				statusColor = 'green';
			} else {
				statusColor = 'red';
			}

			this.INVOICE_ELEMENT.push({
				srno: (index + 1),
				invoiceno: element.inv_invoice_no,
				inv_id: element.inv_id,
				rpt_id: element.rpt_id,
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

	downloadInvoice(invids) {
		const inv_id = invids.split(',');
		this.erpCommonService.downloadInvoice({ inv_id }).subscribe((result: any) => {
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

	downloadReceipt(rpt_id) {
		this.erpCommonService.downloadReceipt({ receipt_id: [rpt_id] }).subscribe((result: any) => {
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

	orderPayment(element) {
		// this.commonAPIService.showSuccessErrorMessage('Sorry ! This service is not Available', 'error');
		this.outStandingAmt = element.feedue;
		this.orderMessage = 'Are you confirm to make payment?  Your Pyament is : <b>' + this.outStandingAmt + '</b>';
		this.makePayment(element);
	}

	// makePayment(element) {
	// 	console.log('Do Payment');
	// 	const inputJson = {
	// 		// invoice_ids: this.studentInvoiceData['inv_ids'],
	// 		inv_login_id: this.loginId,
	// 		// inv_login_id: 1567,
	// 		inv_process_type: this.processType,
	// 		out_standing_amt: this.outStandingAmt
	// 	};

	// 	this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
	// 		localStorage.setItem('paymentData', '');
	// 		if (result && result.status === 'ok') {
	// 			console.log('result.data[0]', result.data[0]);
	// 			this.paytmResult = result.data[0];
	// 			// let ORDER_ID, MID;
	// 			// for (let i = 0; i < this.paytmResult.length; i++) {
	// 			// 	if (this.paytmResult[i]['name'] === 'ORDER_ID') {
	// 			// 		ORDER_ID = this.paytmResult[i]['value'];
	// 			// 	}
	// 			// 	if (this.paytmResult[i]['name'] === 'MID') {
	// 			// 		MID = this.paytmResult[i]['value'];
	// 			// 	}
	// 			// }

	// 			// this.paymentOrderModel.closeDialog();
	// 			localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
	// 			const hostName = window.location.href.split('/')[2];
	// 			window.open('http://' + hostName + '/student/make-payment', 'Payment', 'height=500,width=500,dialog=yes,resizable=no');

	// 				localStorage.setItem('paymentWindowStatus', '1');


	// 			// if (!this.paymentStatus) {
	// 			// 	this.payAPICall = interval(10000).subscribe(x => {
	// 			// 		if (ORDER_ID && MID) {
	// 			// 			this.checkForPaymentStatus(ORDER_ID, MID);
	// 			// 		}
	// 			// 	});
	// 			// }
	// 		} else {
	// 			this.paymentOrderModel.closeDialog();
	// 		}

	// 	});
	// }
	makePayment(element) {
		console.log('Do Payment');
		if (this.counter === 0) {
			this.commonAPIService.showSuccessErrorMessage('No providers avilable', 'error');
		}
		if (this.counter === 1) {
			const bank: any = {
				bank: this.settingArr7[0]
			};
			console.log(bank);
			this.exceutePayment(bank);
		}
		if (this.counter > 1) {
			this.chooser.openModal();
		}
	}
	getMID(value) {
		const index = this.settings.findIndex(f => f.bank_alias === value);
		if (index !== -1) {
			return this.settings[index]['merchant'];
		}
	}
	exceutePayment($event) {
		if ($event && $event.bank) {
			const bank: any = $event.bank;
			const inputJson = {
				inv_login_id: this.loginId,
				inv_process_type: this.processType,
				out_standing_amt: this.outStandingAmt,
				bank: bank
			};
			if (bank === 'axis') {
				this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
					localStorage.setItem('paymentData', '');
					if (result && result.status === 'ok') {
						console.log('result.data[0]', result.data[0]);
						this.paytmResult = result.data[0];
						const ORDER_ID = this.paytmResult.orderId;
						const MID = this.getMID(bank);
						localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
						const hostName = window.location.href.split('/')[2];
						var left = (screen.width / 2) - (800 / 2);
						var top = (screen.height / 2) - (800 / 2);
						window.open('http://' + hostName + '/student/make-payment', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
						top + ',' + 'left=' + left);
						localStorage.setItem('paymentWindowStatus', '1');


						// this.payAPICall = interval(10000).subscribe(x => {

						// });
						this.payAPICall = setInterval(() => {
							if (ORDER_ID && MID) {
								this.checkForPaymentStatus(ORDER_ID, MID);
							}
						}, 10000);



					} else {
						this.paymentOrderModel.closeDialog();
					}

				});
			}
			if (bank === 'paytm') {
				this.erpCommonService.makeTransaction(inputJson).subscribe((result: any) => {
					localStorage.setItem('paymentData', '');
					if (result && result.status === 'ok') {
						this.paytmResult = result.data[0];
						let ORDER_ID, MID;
						for (let i = 0; i < this.paytmResult.length; i++) {
							if (this.paytmResult[i]['name'] === 'ORDER_ID') {
								ORDER_ID = this.paytmResult[i]['value'];
							}
							if (this.paytmResult[i]['name'] === 'MID') {
								MID = this.paytmResult[i]['value'];
							}
						}
						localStorage.setItem('paymentData', JSON.stringify(this.paytmResult));
						const hostName = window.location.href.split('/')[2];
						var left = (screen.width / 2) - (800 / 2);
						var top = (screen.height / 2) - (800 / 2);
						window.open('http://' + hostName + '/student/make-paymentviapg', 'Payment', 'height=800,width=800,dialog=yes,resizable=no, top=' +
						top + ',' + 'left=' + left);
						localStorage.setItem('paymentWindowStatus', '1');
						// this.payAPICall = interval(10000).subscribe(x => {

						// });
						this.payAPICall = setInterval(() => {
							if (ORDER_ID && MID) {
								this.checkForPaymentStatus(ORDER_ID, MID);
							}
						}, 10000);

					} else {
						this.paymentOrderModel.closeDialog();
					}

				});
			}

		}
	}
	checkForPaymentStatus(ORDER_ID, MID) {
		const inputJson = {
			// invoice_ids: this.studentInvoiceData['inv_ids'],	
			inv_login_id: this.loginId,
			// inv_login_id: 1567,
			inv_process_type: this.processType,
			orderId: ORDER_ID,
			mid: MID
		};

		this.erpCommonService.checkForPaymentStatus(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const resultData = result.data;
				console.log(resultData);
				if (resultData && resultData[0]['trans_status'] === 'TXN_SUCCESS' || resultData && resultData[0]['trans_status'] === 'TXN_FAILURE') {
					this.paymentStatus = true;
					clearInterval(this.payAPICall);
					this.getStudentInvoiceDetail();
				}
			}
		});
	}
	ngOnDestroy() {
		if (this.payAPICall) {
			clearInterval(this.payAPICall);
		}
		this.getStudentInvoiceDetail();
	}
}
