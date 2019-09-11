import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { InvoiceElement } from '../fee-transaction-entry/invoiceelement.model';
@Component({
	selector: 'app-fee-transaction-entry-bulk',
	templateUrl: './fee-transaction-entry-bulk.component.html',
	styleUrls: ['./fee-transaction-entry-bulk.component.scss']
})
export class FeeTransactionEntryBulkComponent implements OnInit, AfterViewInit, OnDestroy {
	feeTransactionForm: FormGroup;
	feeTransactionForm2: FormGroup;
	banks: any[] = [];
	entryModes: any[] = [];
	payModes: any[] = [];
	@ViewChild(BarecodeScannerLivestreamComponent)
	barecodeScanner: BarecodeScannerLivestreamComponent;
	barcodeValue;
	invoiceArray: any[] = [];
	currentDate = new Date();
	startMonth: any;
	minDate: any;
	schoolInfo: any;
	checkBulkStatus = false;
	invoice: any = {};
	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	INVOICE_ELEMENT_DATA: InvoiceElement[] = [];
	dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' },
		{ id: '5', name: 'Alumni No.' }
	];
	loaderText: string;
	selectedMode: any = '1';
	allBanks: any[];
	invoiceTypes: any[];
	feePeriods: any[];
	invoiceTotal: any;
	feeLoginId: any;
	class_name: any;
	section_name: any;
	class_sec: any;
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
	ngAfterViewInit() {
		this.barecodeScanner.start();
	}
	buildForm() {
		this.feeTransactionForm = this.fbuild.group({
			'inv_invoice_no': [],
			'login_id': '',
			'ftr_emod_id': '1',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '2',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'saveAndPrint': ''
		});
		this.feeTransactionForm2 = this.fbuild.group({
			'inv_id': [],
			'login_id': '',
			'inv_invoice_no': '',
			'inv_invoice_no2': '',
			'ftr_emod_id': '1',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '1',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'is_cheque': '',
			'ftr_deposit_bnk_id': '',
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
		this.invoiceTypes = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceTypes = result.data;
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
	gotoIndividual($event) {
		if ($event.checked) {
			this.router.navigate(['../fee-transaction-entry-individual'], { relativeTo: this.route });
		}
	}
	onValueChanges(result) {
		this.feeTransactionForm.patchValue({
			inv_invoice_no: ''
		});
		this.barcodeValue = result.codeResult.code;
		this.feeTransactionForm.value.inv_invoice_no = this.barcodeValue;
		const index = this.invoiceArray.indexOf(this.barcodeValue);
		if (index === -1) {
			this.invoiceArray.push(this.barcodeValue);
		} else {
			this.feeTransactionForm.patchValue({
				inv_invoice_no: ''
			});
		}
	}
	checkInv($event) {
		$event.target.value = '';
	}
	insertInvoice($event) {
		this.feeTransactionForm.value.inv_invoice_no = $event.srcElement.value;
		if ($event.code !== 'NumpadEnter' || $event.code !== 'Enter') {
			const index = this.invoiceArray.indexOf($event.srcElement.value);
			if (index === -1) {
				this.invoiceArray.push(this.feeTransactionForm.value.inv_invoice_no);
				this.feeTransactionForm.patchValue({
					inv_invoice_no: ''
				});
			} else {
				this.feeTransactionForm.patchValue({
					inv_invoice_no: ''
				});
			}
		} else {
			const index = this.invoiceArray.indexOf($event.srcElement.value);
			if (index === -1) {
				this.feeTransactionForm.patchValue({
					inv_invoice_no: ''
				});
			} else {
				this.invoiceArray.splice(index, 1);
			}
		}
	}
	deleteInvoice(inv_invoice_no) {
		const index = this.invoiceArray.indexOf(inv_invoice_no);
		if (index !== -1) {
			this.invoiceArray.splice(index, 1);
		}
	}
	submit() {
		this.checkBulkStatus = true;
		this.loaderText = '';
		if (this.feeTransactionForm.valid && this.invoiceArray.length > 0) {
			const datePipe = new DatePipe('en-in');
			this.feeTransactionForm.patchValue({
				'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
				'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
				'saveAndPrint': true
			});
			this.feeTransactionForm.value.inv_invoice_no = this.invoiceArray;
			this.feeTransactionForm.value.isBulk = true;
			let i = 0;
			const x = setInterval(() => {
				this.loaderText =
					'Adding ' +
					' invoices ...';
				i++;
			}, 1);
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					clearInterval(x);
					this.checkBulkStatus = false;
					this.reset();
					this.invoiceArray = [];
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
					this.reset();
					this.invoiceArray = [];
				}
			});
		} else if (this.invoiceArray.length === 0) {
			this.checkBulkStatus = false;
			this.common.showSuccessErrorMessage('Please add invoices to continue', 'error');
		}
	}
	saveAndPrint() {
		this.checkBulkStatus = true;
		this.loaderText = '';
		if (this.feeTransactionForm.valid && this.invoiceArray.length > 0) {
			const datePipe = new DatePipe('en-in');
			this.feeTransactionForm.patchValue({
				'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
				'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
				'saveAndPrint': true
			});
			this.feeTransactionForm.value.inv_invoice_no = this.invoiceArray;
			this.feeTransactionForm.value.isBulk = true;
			let i = 0;
			const x = setInterval(() => {
				this.loaderText =
					'Adding ' +
					' invoices ...';
				i++;
			}, 1);
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					clearInterval(x);
					this.checkBulkStatus = false;
					this.common.showSuccessErrorMessage(result.message, 'success');
					window.open(result.data, '_blank');
					this.reset();
					this.invoiceArray = [];
					this.checkBulkStatus = false;
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
					this.invoiceArray = [];
				}
			});
		} else if (this.invoiceArray.length === 0) {
			this.checkBulkStatus = false;
			this.common.showSuccessErrorMessage('Please add invoices to continue', 'error');
		}
	}

	reset() {
		this.feeTransactionForm.patchValue({
			'inv_invoice_no': [],
			'login_id': '',
			'ftr_emod_id': '1',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '2',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'saveAndPrint': ''
		});
		this.invoiceArray = [];
		this.feeTransactionForm2.patchValue({
			'inv_id': [],
			'inv_invoice_no': '',
			'inv_invoice_no2': '',
			'login_id': '',
			'ftr_emod_id': '1',
			'ftr_transaction_id': '',
			'ftr_transaction_date': new Date(),
			'ftr_pay_id': '1',
			'ftr_cheque_no': '',
			'ftr_cheque_date': '',
			'ftr_bnk_id': '',
			'ftr_branch': '',
			'ftr_amount': '',
			'ftr_remark': '',
			'is_cheque': '',
			'ftr_deposit_bnk_id': '',
			'saveAndPrint': ''
		});
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
	getInvoices(inv_number) {
		this.INVOICE_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
		this.invoiceArray = [];
		const invoiceJSON: any = {
			inv_invoice_no: inv_number
		};
		if (inv_number) {
			document.getElementById('inv_num').blur();
			this.feeService.getInvoiceBifurcation(invoiceJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.INVOICE_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
					this.invoice = {};
					this.invoice = result.data[0];
					this.class_name = this.invoice.class_name;
					this.section_name = this.invoice.sec_name;
					if (this.section_name !== ' ') {
						this.class_sec = this.class_name + ' - ' + this.section_name;
					} else {
						this.class_sec = this.class_name;
					}
					this.feeLoginId = this.invoice.login_id;
					this.invoice.netPay = this.invoice.late_fine_amt ?
						Number(this.invoice.late_fine_amt) + Number(this.invoice.fee_amount) :
						Number(this.invoice.fee_amount);

					if (this.invoice.balance_amt) {
						this.invoice.netPay += Number(this.invoice.balance_amt);
					}
					this.invoiceArray = this.invoice.invoice_bifurcation;
					this.feeTransactionForm2.patchValue({
						'ftr_amount': this.invoice.netPay,
						'ftr_emod_id': this.invoiceArray.length > 0 && this.selectedMode === '1' ? this.selectedMode : '',
					});
					let pos = 1;
					this.invoiceTotal = 0;
					for (const item of this.invoiceArray) {
						this.INVOICE_ELEMENT_DATA.push({
							srno: pos,
							feehead: item.invg_fh_name,
							feedue: item.invg_fh_amount,
							concession: item.invg_fcc_amount,
							adjustment: item.invg_adj_amount,
							// tslint:disable-next-line: max-line-length
							netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
						});
						// tslint:disable-next-line: max-line-length
						this.invoiceTotal += Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0);
						pos++;
					}
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
				} else {
					this.INVOICE_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
					this.invoiceArray = [];
					this.reset();
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Invoice Number cannot be blank', 'error');
		}
	}
	submit2() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm2.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm2.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm2.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': false
		});
		if (this.invoice.late_fine_amt) {
			this.feeTransactionForm2.value.lateFeeAmt = this.invoice.late_fine_amt;
		}
		this.feeTransactionForm2.value.login_id = this.feeLoginId;
		this.feeTransactionForm2.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm2.value.inv_invoice_no = [this.invoice.inv_invoice_no];
		this.feeTransactionForm2.value.is_cheque = this.feeTransactionForm2.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeLoginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (Number(this.invoice.fee_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '1' && this.invoiceArray.length === 0) {
			validateFlag = false;
			this.common.showSuccessErrorMessage('Invoice Number cannot be blank for against invoice', 'error');
		}
		if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 1) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 2) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_bnk_id
				&& this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 3) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount
				&& this.feeTransactionForm2.value.ftr_remark
				&& this.feeTransactionForm2.value.ftr_cheque_date && this.feeTransactionForm2.value.ftr_cheque_no
				&& this.feeTransactionForm2.value.ftr_deposit_bnk_id)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_transaction_id &&
				this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm2.value).subscribe((result: any) => {
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
	saveAndPrint2() {
		const datePipe = new DatePipe('en-in');
		if (this.invoice.late_fine_amt) {
			this.feeTransactionForm2.value.lateFeeAmt = this.invoice.late_fine_amt;
		}
		this.feeTransactionForm2.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm2.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm2.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': true
		});
		this.feeTransactionForm2.value.login_id = this.feeLoginId;
		this.feeTransactionForm2.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm2.value.inv_invoice_no = [this.invoice.inv_invoice_no];
		this.feeTransactionForm2.value.is_cheque = this.feeTransactionForm2.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeLoginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (Number(this.invoice.fee_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '1' && this.invoiceArray.length === 0) {
			validateFlag = false;
			this.common.showSuccessErrorMessage('Invoice Number cannot be blank for against invoice', 'error');
		}
		if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 1) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 2) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_bnk_id
				&& this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm2.value.ftr_pay_id) === 3) {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_bnk_id
				&& this.feeTransactionForm2.value.ftr_remark
				&& this.feeTransactionForm2.value.ftr_cheque_date && this.feeTransactionForm2.value.ftr_cheque_no
				&& this.feeTransactionForm2.value.ftr_deposit_bnk_id)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm2.value.ftr_pay_id &&
				this.feeTransactionForm2.value.ftr_amount && this.feeTransactionForm2.value.ftr_transaction_id &&
				this.feeTransactionForm2.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm2.value).subscribe((result: any) => {
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
	getFeePeriodName(fp_id) {
		const findex = this.feePeriods.findIndex(f => Number(f.fp_id) === Number(fp_id));
		if (findex !== -1) {
			return this.feePeriods[findex].fp_name;
		}
	}
	setPayAmount(event) {
		if (event.value !== '1') {
			this.feeTransactionForm2.patchValue({
				'ftr_amount': this.invoice.fee_amount,
				'ftr_pay_id': event.value
			});
		} else {
			this.feeTransactionForm2.patchValue({
				'ftr_amount': this.invoice.netPay,
				'ftr_pay_id': event.value
			});
		}
	}
	changeTab($event) {
		if (Number($event.index) === 0) {
			this.feeTransactionForm.patchValue({
				'inv_invoice_no': [],
				'login_id': '',
				'ftr_emod_id': '1',
				'ftr_transaction_id': '',
				'ftr_transaction_date': new Date(),
				'ftr_pay_id': '2',
				'ftr_cheque_no': '',
				'ftr_cheque_date': '',
				'ftr_bnk_id': '',
				'ftr_branch': '',
				'ftr_amount': '',
				'ftr_remark': '',
				'saveAndPrint': ''
			});
			this.invoiceArray = [];
			this.barecodeScanner.start();
		} else {
			this.feeTransactionForm2.patchValue({
				'inv_id': [],
				'inv_invoice_no': '',
				'inv_invoice_no2': '',
				'login_id': '',
				'ftr_emod_id': '1',
				'ftr_transaction_id': '',
				'ftr_transaction_date': new Date(),
				'ftr_pay_id': '1',
				'ftr_cheque_no': '',
				'ftr_cheque_date': '',
				'ftr_bnk_id': '',
				'ftr_branch': '',
				'ftr_amount': '',
				'ftr_remark': '',
				'is_cheque': '',
				'ftr_deposit_bnk_id': '',
				'saveAndPrint': ''
			});
			this.barecodeScanner.stop();
		}
	}
	ngOnDestroy() {
		this.barecodeScanner.stop();
	}
}
