import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { BarecodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-fee-transaction-entry-bulk',
	templateUrl: './fee-transaction-entry-bulk.component.html',
	styleUrls: ['./fee-transaction-entry-bulk.component.scss']
})
export class FeeTransactionEntryBulkComponent implements OnInit, AfterViewInit, OnDestroy {
	feeTransactionForm: FormGroup;
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
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' },
		{ id: '5', name: 'Alumni No.' }
	];
	loaderText: string;
	constructor(private router: Router,
		private route: ActivatedRoute,
		private sisService: SisService,
		public processtypeService: ProcesstypeFeeService,
		public feeService: FeeService,
		private fbuild: FormBuilder,
		public common: CommonAPIService) { }

	ngOnInit() {
		this.getSchool();
		this.getBanks();
		this.getEntryModes();
		this.getPayModes();
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

	}
	getEntryModes() {
		this.feeService.getEntryMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.entryModes = result.data;
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
	insertInvoice($event) {
		this.feeTransactionForm.value.inv_invoice_no = $event.srcElement.value;
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
					this.reset();
					this.invoiceArray = [];
				}
			});
		} else if (this.invoiceArray.length === 0) {
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
	}
	ngOnDestroy() {
		this.barecodeScanner.stop();
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
}
