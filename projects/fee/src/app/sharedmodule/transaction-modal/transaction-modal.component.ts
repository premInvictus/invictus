import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-transaction-modal',
	templateUrl: './transaction-modal.component.html',
	styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit {
	feeData: any;
	schoolInfo: any;
	feeTransactionForm2: FormGroup;
	banks: any[] = [];
	entryModes: any[] = [];
	payModes: any[] = [];
	startMonth: any;
	minDate: any;
	selectedMode: any = '2';
	allBanks: any[];
	invoiceTypes: any[];
	feePeriods: any[];
	@Input() transactionMessage;
	@Output() transactionOk = new EventEmitter<any>();
	@Output() transactionCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<TransactionModalComponent>;
	@ViewChild('transactionModal') transactionModal;
	constructor(private dialog: MatDialog,
		private fbuild: FormBuilder,
		private sisService: SisService,
		public feeService: FeeService, 
		private common : CommonAPIService) { }

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


	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
				this.startMonth = Number(this.schoolInfo.session_start_month);
				this.minDate = new Date(new Date().getFullYear(), this.startMonth - 1, 1);
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

	getFeePeriods() {
		this.feePeriods = [];
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriods = result.data;
			}
		});
	}



	buildForm() {
		this.feeTransactionForm2 = this.fbuild.group({
			'inv_id': [],
			'inv_process_type':'4',
			'login_id': '',
			'inv_invoice_no': '',
			'inv_invoice_no2': '',
			'ftr_emod_id': '2',
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

	setPayAmount(event) {

		this.feeTransactionForm2.patchValue({
			'ftr_amount': this.feeData.inv_fee_amount,
			'ftr_pay_id': event.value
		});

	}


	openModal(data) {
		console.log('data', data);
		this.feeData = data;
		this.dialogRef = this.dialog.open(this.transactionModal, {
			width: '550px',
		});


		this.feeTransactionForm2.patchValue({
			'ftr_amount': this.feeData.inv_fee_amount,
			'ftr_pay_id': '1'
		});
	}
	okDialog() {
		this.transactionOk.emit(this.feeData);
	}

	cancel() {
		this.transactionCancel.emit(this.feeData);
	}
	onNoClick() {
		this.dialogRef.close();
	}


	submit2() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm2.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm2.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm2.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': false
		});
		
		this.feeTransactionForm2.value.lateFeeAmt = 0;
		
		this.feeTransactionForm2.value.login_id = this.feeData.flgr_login_id;
		this.feeTransactionForm2.value.inv_id = [];
		this.feeTransactionForm2.value.inv_invoice_no = [];
		this.feeTransactionForm2.value.ses_id = this.feeData.flgr_ses_id;
		this.feeTransactionForm2.value.is_cheque = this.feeTransactionForm2.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeData.flgr_login_id) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (Number(this.feeData.inv_fee_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
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
					this.dialogRef.close();
					this.transactionOk.emit(this.feeData);
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
				}
			});
		}
	}
	saveAndPrint2() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm2.value.lateFeeAmt = 0;
		this.feeTransactionForm2.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm2.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm2.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': true
		});
		this.feeTransactionForm2.value.login_id = this.feeData.flgr_login_id;
		this.feeTransactionForm2.value.inv_id = [];
		this.feeTransactionForm2.value.inv_invoice_no = [];
		this.feeTransactionForm2.value.ses_id = this.feeData.flgr_ses_id;
		this.feeTransactionForm2.value.is_cheque = this.feeTransactionForm2.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeData.flgr_login_id) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (Number(this.feeData.inv_fee_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
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
					saveAs(result.data, result.data.split('/')[length - 1]);
					window.open(result.data, '_blank');
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.dialogRef.close();					
					this.reset();
					this.transactionOk.emit(this.feeData);
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
				}
			});
		}
	}

	reset() {
		// this.invoiceArray = [];
		this.feeTransactionForm2.patchValue({
			'inv_id': [],
			'inv_invoice_no': '',
			'inv_invoice_no2': '',
			'inv_process_type':'4',
			'login_id': '',
			'ftr_emod_id': '2',
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

}
