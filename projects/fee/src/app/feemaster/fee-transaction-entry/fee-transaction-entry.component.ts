import { Component, OnInit } from '@angular/core';
import { SisService, ProcesstypeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InvoiceElement } from './invoiceelement.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-fee-transaction-entry',
	templateUrl: './fee-transaction-entry.component.html',
	styleUrls: ['./fee-transaction-entry.component.scss']
})
export class FeeTransactionEntryComponent implements OnInit {
	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	INVOICE_ELEMENT_DATA: InvoiceElement[] = [];
	dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	selectedMode: any;
	lastRecordId;
	loginId: any;
	feeLoginId: any;
	feeTransactionForm: FormGroup;
	invoiceArray: any[] = [];
	studentInfo: any = {};
	invoiceTotal: any;
	entryModes: any[] = [];
	payModes: any[] = [];
	invoice: any = {};
	feePeriods: any[] = [];
	invoiceTypes: any[] = [];
	banks: any[] = [];
	allBanks: any[] = [];
	permission = false;
	currentDate = new Date();
	minDate: any;
	schoolInfo: any;
	startMonth: any;
	constructor(
		private sisService: SisService,
		public processtypeService: ProcesstypeService,
		public feeService: FeeService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		private router: Router,
		private route: ActivatedRoute,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.invoiceArray = [];
		this.invoice = {};
		this.selectedMode = '';
		this.getSchool();
		this.getAllBanks();
		this.getBanks();
		this.getInvoiceTypes();
		this.getFeePeriods();
		this.getEntryModes();
		this.getPayModes();
		this.buildForm();
		if (this.common.isExistUserAccessMenu('368')) {
			this.permission = true;
		} else {
			this.permission = false;
		}
		this.selectedMode = '';
		this.processtypeService.setProcesstype('4');
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.lastRecordId = result.data[0].last_record;
				this.loginId = result.data[0].au_login_id;
				this.feeLoginId = this.loginId;
				this.getStudentInformation(this.lastRecordId);
			}
		});
	}
	buildForm() {
		this.feeTransactionForm = this.fbuild.group({
			'inv_id': [],
			'login_id': '',
			'ftr_emod_id': '',
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
			'saveAndPrint' : ''
		});
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
				this.startMonth = Number(this.schoolInfo.session_start_month);
				this.minDate = new Date(new Date().getFullYear(), this.startMonth - 1 , 1);
			}
		});
	}
	getInvoices(inv_number) {
		this.INVOICE_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
		this.invoiceArray = [];
		const invoiceJSON: any = {
			inv_id: inv_number
		};
		this.feeService.getInvoiceBifurcation(invoiceJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.INVOICE_ELEMENT_DATA = [];
				this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
				this.invoice = {};
				this.invoice = result.data[0];
				this.invoice.netPay = this.invoice.late_fine_amt ?
										Number(this.invoice.late_fine_amt) + Number(this.invoice.fee_amount) :
										Number(this.invoice.fee_amount);
				this.invoiceArray = this.invoice.invoice_bifurcation;
				this.feeTransactionForm.patchValue({
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
						netpay: Number(item.invg_total_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
					});
					this.invoiceTotal += Number(item.invg_total_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0);
					pos++;
				}
				this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
			}
		});
	}
	getStudentInformation(login_id) {
		this.studentInfo = {};
		this.feeTransactionForm.patchValue({
			'inv_id': [],
			'login_id': '',
			'ftr_emod_id': '',
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
			'saveAndPrint' : ''
		});
		this.sisService.getStudentInformation({ au_login_id: login_id, au_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentInfo = result.data[0];
				this.selectedMode = '1';
				if (this.studentInfo.last_invoice_number) {
					this.getInvoices(this.studentInfo.last_invoice_number);
				} else {
					this.invoiceArray = [];
					this.INVOICE_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
					this.selectedMode = '';
				}
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
	next(admno) {
		this.loginId = admno;
		this.getStudentInformation(this.loginId);
	}
	prev(admno) {
		this.loginId = admno;
		this.getStudentInformation(this.loginId);
	}
	first(admno) {
		this.loginId = admno;
		this.getStudentInformation(this.loginId);
	}
	last(admno) {
		this.loginId = admno;
		this.getStudentInformation(this.loginId);
	}
	key(admno) {
		this.loginId = admno;
		this.getStudentInformation(this.loginId);
	}
	next2(admno) {
		this.feeLoginId = admno;
	}
	prev2(admno) {
		this.feeLoginId = admno;
	}
	first2(admno) {
		this.feeLoginId = admno;
	}
	last2(admno) {
		this.feeLoginId = admno;
	}
	key2(admno) {
		this.feeLoginId = admno;
	}
	getFeePeriods() {
		this.feePeriods = [];
		this.feeService.getFeePeriods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriods = result.data;
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
	getAllBanks() {
		this.allBanks = [];
		this.feeService.getBanksAll({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.allBanks = result.data;
			}
		});
	}
	getFeePeriodName(fp_id) {
		const findex = this.feePeriods.findIndex(f => Number(f.fp_id) === Number(fp_id));
		if (findex !== -1) {
			return this.feePeriods[findex].fp_name;
		}
	}
	getInvoiceTypes() {
		this.invoiceTypes = [];
		this.feeService.getCalculationMethods({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceTypes = result.data;
			}
		});
	}
	getInvoiceTypeName(calm_id) {
		const findex = this.invoiceTypes.findIndex(f => Number(f.calm_id) === Number(calm_id));
		if (findex !== -1) {
			return this.invoiceTypes[findex].calm_name;
		}
	}
	submit() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint' : false
		});
		this.feeTransactionForm.value.login_id = this.feeLoginId;
		this.feeTransactionForm.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.loginId) {
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
		if (!this.feeTransactionForm.valid) {
			this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
			validateFlag = false;
		}
		if (validateFlag) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage('Fee transaction added', 'success');
					this.reset();
					this.getStudentInformation(this.loginId);
				} else {
					this.common.showSuccessErrorMessage('Fee transaction not added', 'error');
					this.reset();
					this.getStudentInformation(this.loginId);
				}
			});
		}
	}
	saveAndPrint() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint' : true
		});
		this.feeTransactionForm.value.login_id = this.feeLoginId;
		this.feeTransactionForm.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.loginId) {
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
		if (!this.feeTransactionForm.valid) {
			this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
			validateFlag = false;
		}
		if (validateFlag) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
					this.reset();
					this.getStudentInformation(this.loginId);
				} else {
					this.reset();
					this.getStudentInformation(this.loginId);
				}
			});
		}
	}
	gotoIndividual($event) {
		if (!($event.checked)) {
			this.router.navigate(['../fee-transaction-entry-bulk'], { relativeTo: this.route });
		}
	}
	getSelectedMode($event) {
		this.selectedMode = $event.value;
	}

	reset() {
		this.feeTransactionForm.patchValue({
			'inv_id': [],
			'login_id': '',
			'ftr_emod_id': '',
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
			'saveAndPrint' : ''
		});
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
			this.getStudentInformation(this.loginId);

		});
	}
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
}
