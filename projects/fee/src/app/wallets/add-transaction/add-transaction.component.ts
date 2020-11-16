import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
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
	currentDate = new Date();
	minDate: any;
	schoolInfo: any;
	startMonth: any;
	type: any = '';
	feeRenderId: any = '';
	btnDisable = false;
	currentInvoiceId = '';
	constructor(
		private sisService: SisService,
		public processtypeService: ProcesstypeFeeService,
		public feeService: FeeService,
		private fbuild: FormBuilder,
		public common: CommonAPIService,
		private router: Router,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
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
		this.selectedMode = '';
		const invDet: any = this.studentRouteMoveStoreService.getInvoiceId();
		if (!(invDet.inv_id)) {
			this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
				if (data.adm_no && data.login_id) {
					this.lastRecordId = data.adm_no;
					this.loginId = data.adm_no;
					this.feeLoginId = data.login_id;
					this.getStudentInformation(this.lastRecordId);
				} else {
					this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
						if (result.status === 'ok') {
							this.lastRecordId = result.data[0].last_record;
							this.loginId = result.data[0].au_login_id;
							this.feeLoginId = this.loginId;
							this.getStudentInformation(this.lastRecordId);
						}
					});
				}

			});
		}
	}
	buildForm() {
		this.feeTransactionForm = this.fbuild.group({
			'login_id': '',
			'w_transaction_id': '',
			'w_transaction_date': new Date(),
			'w_pay_id': '1',
			'w_cheque_no': '',
			'w_cheque_date': '',
			'w_bnk_id': '',
			'w_branch': '',
      'w_amount': '',
      'w_amount_type':'',
			'w_remarks': '',
			'is_cheque': '',
			'w_deposit_bnk_id': '',
			'saveAndPrint': ''
		});
	}
	checkEmit(process_type) {
		if (process_type) {
			this.type = process_type;
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				if (result.status === 'ok') {
					this.lastRecordId = result.data[0].last_record;
					this.loginId = result.data[0].au_login_id;
					this.feeLoginId = this.loginId;
					this.getStudentInformation(this.lastRecordId);
				}
			});
		}
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
	getStudentInformation(login_id) {
		this.studentInfo = {};
		this.feeTransactionForm.patchValue({
			'login_id': '',
			'w_transaction_id': '',
			'w_transaction_date': new Date(),
			'w_pay_id': '1',
			'w_cheque_no': '',
			'w_cheque_date': '',
			'w_bnk_id': '',
			'w_branch': '',
      'w_amount': '',
      'w_amount_type':'',
			'w_remarks': '',
			'is_cheque': '',
			'w_deposit_bnk_id': '',
			'saveAndPrint': ''
		});
		this.sisService.getStudentInformation({ au_login_id: login_id, au_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentInfo = result.data[0];
				this.selectedMode = '1';
				if (this.studentInfo.last_invoice_number) {
					this.currentInvoiceId = this.studentInfo.last_invoice_number;
				} else {
					this.invoiceArray = [];
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
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getStudentInformation(this.loginId);
		} else {
			this.getStudentInformation(this.loginId);
		}
	}
	prev(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getStudentInformation(this.loginId);
		} else {
			this.getStudentInformation(this.loginId);
		}
	}
	first(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getStudentInformation(this.loginId);
		} else {
			this.getStudentInformation(this.loginId);
		}
	}
	last(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getStudentInformation(this.loginId);
		} else {
			this.getStudentInformation(this.loginId);
		}
	}
	key(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getStudentInformation(this.loginId);
		} else {
			this.getStudentInformation(this.loginId);
		}
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
			'w_cheque_date': datePipe.transform(this.feeTransactionForm.value.w_cheque_date, 'yyyy-MM-dd'),
			'w_transaction_date': datePipe.transform(this.feeTransactionForm.value.w_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': false
		});
		this.feeTransactionForm.value.login_id = this.feeLoginId;
		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.w_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.loginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (Number(this.feeTransactionForm.value.w_amount) <= 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (Number(this.feeTransactionForm.value.w_pay_id) === 1) {
			if (!(this.feeTransactionForm.value.w_pay_id &&
				this.feeTransactionForm.value.w_remarks)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.w_pay_id) === 2) {
			if (!(this.feeTransactionForm.value.w_pay_id &&
				this.feeTransactionForm.value.w_bnk_id
				&& this.feeTransactionForm.value.w_remarks)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.w_pay_id) === 3) {
			if (!(this.feeTransactionForm.value.w_pay_id &&
				this.feeTransactionForm.value.w_deposit_bnk_id
				&& this.feeTransactionForm.value.w_remarks
				&& this.feeTransactionForm.value.w_cheque_date && this.feeTransactionForm.value.w_cheque_no)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm.value.w_pay_id &&
				this.feeTransactionForm.value.w_transaction_id &&
				this.feeTransactionForm.value.w_remarks)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
      this.feeTransactionForm.value.w_amount_type='credit';
			this.btnDisable = true;
			this.feeService.insertWallets(this.feeTransactionForm.value).subscribe((result: any) => {
				this.btnDisable = false;
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.messsage, 'success');
					this.reset();
					this.getStudentInformation(this.lastRecordId);
					this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
					this.getStudentInformation(this.lastRecordId);
					this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				}
			});
		} else {
			this.btnDisable = false;
		}
	}
	getSelectedMode($event) {
		this.selectedMode = $event.value;
		if (this.selectedMode !== '1') {
			this.feeTransactionForm.patchValue({
				'w_amount': this.invoice.fee_amount,
			});
		} else {
			this.feeTransactionForm.patchValue({
				'w_amount': this.invoice.netPay,
			});
		}
	}

	reset() {
		this.btnDisable = false;
		this.feeTransactionForm.patchValue({
			'login_id': '',
			'w_transaction_id': '',
			'w_transaction_date': new Date(),
			'w_pay_id': '1',
			'w_cheque_no': '',
			'w_cheque_date': '',
			'w_bnk_id': '',
			'w_branch': '',
      'w_amount': '',
      'w_amount_type':'',
			'w_remarks': '',
			'is_cheque': '',
			'w_deposit_bnk_id': '',
			'saveAndPrint': ''
		});
	}

	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	setPayAmount(event) {
		if (event.value === 2 || event.value === '2') {
			// tslint:disable-next-line: max-line-length
			let netAmount = parseInt(this.invoice.fee_amount, 10) + parseInt(this.invoice.inv_fine_amount, 10) + parseInt(this.invoice.inv_prev_balance, 10);

			if (netAmount < 0) {
				netAmount = 0;
			}

			this.feeTransactionForm.patchValue({
				'w_amount': netAmount,
				'w_pay_id': event.value
			});
		} else {
			this.feeTransactionForm.patchValue({
				'w_amount': this.invoice.netPay,
				'w_pay_id': event.value
			});
		}
	}
	checkStatus() {
		if (this.commonStu.studentdetails.editable_status === '1') {
			return true;
		} else {
			return false;
		}
	}
	ngOnDestroy() {
		this.studentRouteMoveStoreService.setInvoiceId({});
	}

}
