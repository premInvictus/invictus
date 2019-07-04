import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { InvoiceElement } from '../fee-transaction-entry/invoiceelement.model';

@Component({
	selector: 'app-fee-modification',
	templateUrl: './fee-modification.component.html',
	styleUrls: ['./fee-modification.component.scss']
})
export class FeeModificationComponent implements OnInit {
	modifyReceiptForm: FormGroup;
	banks: any[] = [];
	entryModes: any[] = [];
	payModes: any[] = [];
	barcodeValue;
	invoiceArray: any[] = [];
	receiptArray: any[] = [];
	currentDate = new Date();
	startMonth: any;
	minDate: any;
	schoolInfo: any;
	checkBulkStatus = false;
	invoice: any = {};
	receipt: any = {};
	loaderText: string;
	selectedMode: any = '1';
	allBanks: any[];
	receiptTypes: any[];
	feePeriods: any[];
	invoiceTotal: any;
	feeLoginId: any;
	class_name: any;
	section_name: any;
	class_sec: any;
	inv_invoice_date: any;
	inv_due_date: any;
	showForm = false;
	constructor(private router: Router,
		private route: ActivatedRoute,
		private sisService: SisService,
		public processtypeService: ProcesstypeFeeService,
		public feeService: FeeService,
		private fbuild: FormBuilder,
		public common: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getSchool();
		this.getBanks();
		this.getEntryModes();
		this.getPayModes();
		this.getSchool();
		this.getAllBanks();
		this.getInvoiceTypes();
		this.getFeePeriods();
		this.buildForm();
	}
	buildForm() {
		this.modifyReceiptForm = this.fbuild.group({
			'inv_id': [],
			'rpt_id' : '',
			'ftr_id' : '',
			'ftr_inv_id' : '',
			'ftr_rpt_no' : '',
			'login_id': '',
			'inv_invoice_no': '',
			'inv_receipt_no': '',
			'inv_invoice_date': '',
			'inv_due_date': '',
			'ftr_emod_id': '',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'is_cheque': '',
			'ftr_deposit_bnk_id': '',
			'ftr_fine_amount' : '',
			'ftr_prev_balance' : '',
			'saveAndPrint': ''
		});

	}
	getEntryModes() {
		this.feeService.getEntryMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.entryModes = result.data;
			}
		});
	}
	getFeePeriods() {
		this.feePeriods = [];
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriods = result.data;
			}
		});
	}
	getPayModes() {
		this.feeService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.payModes = result.data;
			}
		});
	}
	getBanks() {
		this.banks = [];
		this.feeService.getBanks({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.banks = result.data;
			}
		});
	}
	getInvoiceTypes() {
		this.receiptTypes = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.receiptTypes = result.data;
			}
		});
	}
	getAllBanks() {
		this.allBanks = [];
		this.feeService.getBanksAll({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.allBanks = result.data;
			}
		});
	}

	checkInv($event) {
		$event.target.value = '';
	}

	getFeePeriodName(fp_id) {
		const findex = this.feePeriods.findIndex(f => Number(f.fp_id) === Number(fp_id));
		if (findex !== -1) {
			return this.feePeriods[findex].fp_name;
		}
	}
	setPayAmount(event) {
		if (event.value !== '1') {
			this.modifyReceiptForm.patchValue({
				'ftr_amount': this.receipt.fee_amount,
				'ftr_pay_id': event.value
			});
		} else {
			this.modifyReceiptForm.patchValue({
				'ftr_amount': this.receipt.netPay,
				'ftr_pay_id': event.value
			});
		}
	}

	reset() {
		this.receiptArray = [];
		this.modifyReceiptForm.patchValue({
			'inv_id': [],
			'rpt_id' : '',
			'ftr_id' : '',
			'ftr_inv_id' : '',
			'ftr_rpt_no' : '',
			'login_id': '',
			'inv_invoice_no': '',
			'inv_receipt_no': '',
			'inv_invoice_date': '',
			'inv_due_date': '',
			'ftr_emod_id': '',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'is_cheque': '',
			'ftr_deposit_bnk_id': '',
			'ftr_fine_amount' : '',
			'ftr_prev_balance' : '',
			'saveAndPrint': ''
		});
		this.showForm = false;
	}
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
				this.startMonth = Number(this.schoolInfo.session_start_month);
				this.minDate = new Date(new Date().getFullYear(), this.startMonth - 1, 1);
			}
		});
	}
	openDialog(inv_invoice_no, edit) {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				inv_invoice_no: inv_invoice_no,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});
	}
	openReceiptDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			height: '80vh',
			data: {
				rpt_id: invoiceNo,
				edit: edit
			},
			hasBackdrop: true
		});
	}

	getReceipt(rpt_number, type) {
		this.receiptArray = [];
		const receiptJSON: any = {};
		if (type == 'receipt') {
			receiptJSON.flgr_invoice_receipt_no = rpt_number;
			document.getElementById('rpt_num').blur();
		} else if (type == 'invoice') {
			receiptJSON.invoice_no = rpt_number;
			document.getElementById('inv_num').blur();
		}

		if (rpt_number) {
			this.feeService.getReceiptBifurcation(receiptJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.receipt = {};
					this.receipt = result.data[0];
					this.receipt.rpt_prev_balance = this.receipt.rpt_prev_balance ? this.receipt.rpt_prev_balance : 0;
					this.receipt.inv_opening_balance = this.receipt.inv_opening_balance ? this.receipt.inv_opening_balance : 0;
					this.receipt.fin_prev_balance = this.receipt.rpt_prev_balance + this.receipt.inv_opening_balance;
					this.class_name = this.receipt.class_name;
					this.section_name = this.receipt.sec_name;
					if (this.section_name !== ' ') {
						this.class_sec = this.class_name + ' - ' + this.section_name;
					} else {
						this.class_sec = this.class_name;
					}
					this.feeLoginId = this.receipt.login_id;
					this.receipt.netPay = this.receipt.rpt_net_amount ? Number(this.receipt.rpt_net_amount) : 0;

					if (this.receipt.ftr_emod_id === '2' || this.receipt.ftr_emod_id === 2) {
						//this.receiptArray['ftr_id'] =  this.receipt.ftr_id;
						this.receiptArray = [{ftr_id: this.receipt.ftr_id}];
					} else {
						this.receiptArray = this.receipt.invoice_bifurcation;
					}

					console.log(this.receiptArray.length);
					this.modifyReceiptForm.patchValue({
						'rpt_id' : this.receipt.receipt_id,
						'rpt_inv_id': this.receipt.inv_id,
						'inv_invoice_no': this.receipt.inv_invoice_no,
						'inv_receipt_no': this.receipt.rpt_receipt_no,
						'login_id': this.receipt.login_id,
						'ftr_transaction_id': this.receipt.ftr_transaction_id,
						'ftr_transaction_date': this.receipt.ftr_transaction_date,
						'ftr_id' : this.receipt.ftr_id,
						'ftr_inv_id' : this.receipt.ftr_inv_id,
						'ftr_emod_id' : this.receipt.ftr_emod_id,
						'ftr_pay_id': this.receipt.ftr_pay_id,
						'ftr_amount': this.receipt.netPay,
						'ftr_remark' : this.receipt.ftr_remark ? this.receipt.ftr_remark : '',
						'ftr_cheque_no': this.receipt.ftr_cheque_no,
						'ftr_cheque_date': this.receipt.ftr_cheque_date,
						'ftr_bnk_id': this.receipt.ftr_bnk_id,
						'ftr_branch': this.receipt.ftr_branch,
						'is_cheque': this.receipt.ftr_cheque_no > 0 ? true : false,
						'ftr_deposit_bnk_id': this.receipt.ftr_deposit_bnk_id,
						'ftr_rpt_no' : this.receipt.ftr_rpt_no
					});
					this.showForm = true;
				} else {
					this.receiptArray = [];
					this.reset();
					this.common.showSuccessErrorMessage(result.message, 'error');
					this.showForm = false;
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Invoice/Receipt Number cannot be blank', 'error');
			this.showForm = false;
		}
	}

	updateReceipt() {
		const datePipe = new DatePipe('en-in');
		this.modifyReceiptForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.modifyReceiptForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.modifyReceiptForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': false
		});
		if (this.receipt.late_fine_amt) {
			this.modifyReceiptForm.value.lateFeeAmt = this.receipt.late_fine_amt;
		}
		this.modifyReceiptForm.value.login_id = this.feeLoginId;
		this.modifyReceiptForm.value.inv_id = [this.receipt.inv_id];
		this.modifyReceiptForm.value.inv_invoice_no = [this.receipt.inv_invoice_no];
		this.modifyReceiptForm.value.is_cheque = this.modifyReceiptForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeLoginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}

		if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 1) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 2) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_bnk_id
				&& this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 3) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_bnk_id
				&& this.modifyReceiptForm.value.ftr_remark
				&& this.modifyReceiptForm.value.ftr_cheque_date && this.modifyReceiptForm.value.ftr_cheque_no
				&& this.modifyReceiptForm.value.ftr_deposit_bnk_id && this.modifyReceiptForm.value.ftr_branch)) {
				validateFlag = false;
			}
		} else {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount &&  this.modifyReceiptForm.value.ftr_transaction_id &&
				this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		}

		console.log('this.modifyReceiptForm.value', this.modifyReceiptForm.value);
		if (validateFlag) {
			this.feeService.updateReceipt(this.modifyReceiptForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.messsage, 'success');
					this.reset();
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
				}
			});
		}
	}
	saveAndPrintReceipt() {
		const datePipe = new DatePipe('en-in');
		if (this.receipt.late_fine_amt) {
			this.modifyReceiptForm.value.lateFeeAmt = this.receipt.late_fine_amt;
		}
		this.modifyReceiptForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.modifyReceiptForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.modifyReceiptForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': true
		});
		this.modifyReceiptForm.value.login_id = this.feeLoginId;
		this.modifyReceiptForm.value.inv_id = [this.receipt.inv_id];
		this.modifyReceiptForm.value.inv_invoice_no = [this.receipt.inv_invoice_no];
		this.modifyReceiptForm.value.is_cheque = this.modifyReceiptForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeLoginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}

		if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 1) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 2) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_bnk_id
				&& this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.modifyReceiptForm.value.ftr_pay_id) === 3) {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount && this.modifyReceiptForm.value.ftr_bnk_id
				&& this.modifyReceiptForm.value.ftr_remark
				&& this.modifyReceiptForm.value.ftr_cheque_date && this.modifyReceiptForm.value.ftr_cheque_no
				&& this.modifyReceiptForm.value.ftr_deposit_bnk_id && this.modifyReceiptForm.value.ftr_branch)) {
				validateFlag = false;
			}
		} else {
			if (!(this.modifyReceiptForm.value.ftr_pay_id &&
				this.modifyReceiptForm.value.ftr_amount &&  this.modifyReceiptForm.value.ftr_transaction_id &&
				this.modifyReceiptForm.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
			this.feeService.updateReceipt(this.modifyReceiptForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					const length = result.data.split('/').length;
					this.common.showSuccessErrorMessage(result.message, 'success');
					window.open(result.data, '_blank');
					this.reset();
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
				}
			});
		}
	}
}
