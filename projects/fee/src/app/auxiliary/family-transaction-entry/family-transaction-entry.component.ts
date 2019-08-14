import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InvoiceElement } from './invoiceelement.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../../feemaster/invoice-details-modal/invoice-details-modal.component';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../../feemaster/student-route-move-store.service';
import { CommonStudentProfileComponent } from '../../feemaster/common-student-profile/common-student-profile.component';
@Component({
	selector: 'app-family-transaction-entry',
	templateUrl: './family-transaction-entry.component.html',
	styleUrls: ['./family-transaction-entry.component.css']
})
export class FamilyTransactionEntryComponent implements OnInit {
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
	childDataArr: any[] = [];
	selectedMode: any;
	// lastRecordId;
	loginId: any;
	feeLoginId: any;
	feeTransactionForm: FormGroup;
	invoiceArray: any[] = [];
	familyOutstandingArr: any[] = [];
	// studentInfo: any = {};
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

		const familyData = this.common.getSelectedChildData();
		if (familyData) {
			console.log('family number', familyData);
			this.getFamilyOutstandingDetail(familyData);
		} else {
			this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
		}

		// if (!(invDet.inv_id)) {
		// 	// this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
		// 	// 	if (data.adm_no && data.login_id) {
		// 	// 		this.lastRecordId = data.adm_no;
		// 	// 		this.loginId = data.adm_no;
		// 	// 		this.feeLoginId = data.login_id;
		// 	// 		this.getStudentInformation(this.lastRecordId);
		// 	// 	} else {
		// 	// 		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
		// 	// 			if (result.status === 'ok') {
		// 	// 				this.lastRecordId = result.data[0].last_record;
		// 	// 				this.loginId = result.data[0].au_login_id;
		// 	// 				this.feeLoginId = this.loginId;
		// 	// 				this.getStudentInformation(this.lastRecordId);
		// 	// 			}
		// 	// 		});
		// 	// 	}

		// 	// });
		// } else {
		// const invDet2: any = this.studentRouteMoveStoreService.getInvoiceId();
		// this.lastRecordId = invDet2.au_admission_no;
		// this.loginId = invDet2.login_id;
		// this.feeLoginId = this.loginId;
		// this.studentInfo = {};
		this.feeTransactionForm.patchValue({
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
			'saveAndPrint': ''
		});
		this.selectedMode = '1';
		// this.getInvoices(invDet2.inv_id);
		// }
	}
	buildForm() {
		this.feeTransactionForm = this.fbuild.group({
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
			'saveAndPrint': ''
		});
	}

	getFamilyOutstandingDetail(familyData) {
		// this.familyOutstandingArr = [];
		// this.childDataArr = [];
		// this.feeService.getFamilyOutstandingDetail({ fam_entry_number: familyNumber }).subscribe((result: any) => {
		// 	if (result && result.status === 'ok') {
		// 		console.log('result.data', result.data);
		// 		this.familyOutstandingArr = result.data;
		// 		this.childDataArr = result.data.childData;
		// 		this.feeTransactionForm.patchValue({
		// 			'ftr_amount': this.familyOutstandingArr['family_total_outstanding_amt'],
		// 		});
		// 	}
		// });

		this.familyOutstandingArr = familyData;
		this.childDataArr = familyData.childData;
		if (this.familyOutstandingArr) {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.familyOutstandingArr['family_total_outstanding_amt'],
			});
		}
	}

	// checkEmit(process_type) {
	// 	if (process_type) {
	// 		this.type = process_type;
	// 		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
	// 			if (result.status === 'ok') {
	// 				this.lastRecordId = result.data[0].last_record;
	// 				this.loginId = result.data[0].au_login_id;
	// 				this.feeLoginId = this.loginId;
	// 				this.getStudentInformation(this.lastRecordId);
	// 			}
	// 		});
	// 	}
	// }
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
				this.startMonth = Number(this.schoolInfo.session_start_month);
				this.minDate = new Date(new Date().getFullYear(), this.startMonth - 1, 1);
			}
		});
	}
	// getInvoices(inv_number) {
	// 	this.INVOICE_ELEMENT_DATA = [];
	// 	this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	// 	this.invoiceArray = [];
	// 	const invoiceJSON: any = {
	// 		inv_id: inv_number
	// 	};
	// 	this.feeService.getInvoiceBifurcation(invoiceJSON).subscribe((result: any) => {
	// 		if (result && result.status === 'ok') {
	// 			this.INVOICE_ELEMENT_DATA = [];
	// 			this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	// 			this.invoice = {};
	// 			this.invoice = result.data[0];
	// 			this.invoice.netPay = this.invoice.late_fine_amt ?
	// 				Number(this.invoice.late_fine_amt) + Number(this.invoice.fee_amount) :
	// 				Number(this.invoice.fee_amount);


	// 			if (this.invoice.balance_amt) {
	// 				this.invoice.balance_amt = Number(this.invoice.balance_amt);
	// 				this.invoice.netPay += Number(this.invoice.balance_amt);
	// 			}
	// 			// if (this.invoice.prev_balance) {
	// 			// 	this.invoice.netPay += Number(this.invoice.prev_balance);
	// 			// 	this.invoice.balance_amt += Number(this.invoice.prev_balance);
	// 			// }

	// 			if (this.invoice.netPay < 0) {
	// 				this.invoice.netPay = 0;
	// 			}


	// 			this.invoiceArray = this.invoice.invoice_bifurcation;
	// 			this.feeTransactionForm.patchValue({
	// 				'ftr_amount': this.invoice.netPay,
	// 				'ftr_emod_id': this.invoiceArray.length > 0 && this.selectedMode === '1' ? this.selectedMode : '',
	// 			});
	// 			let pos = 1;
	// 			this.invoiceTotal = 0;
	// 			if (this.invoice.inv_prev_balance && Number(this.invoice.inv_prev_balance) !== 0) {
	// 				const element = {
	// 					srno: pos,
	// 					feehead: 'Previous Balance',
	// 					feedue: Number(this.invoice.inv_prev_balance),
	// 					concession: 0,
	// 					adjustment: 0,
	// 					netpay: Number(this.invoice.inv_prev_balance)
	// 				};
	// 				this.invoiceTotal += element.netpay;
	// 				this.INVOICE_ELEMENT_DATA.push(element);
	// 			}
	// 			for (const item of this.invoiceArray) {
	// 				this.INVOICE_ELEMENT_DATA.push({
	// 					srno: pos,
	// 					feehead: item.invg_fh_name,
	// 					feedue: item.invg_fh_amount,
	// 					concession: item.invg_fcc_amount,
	// 					adjustment: item.invg_adj_amount,
	// 					// tslint:disable-next-line: max-line-length
	// 					netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
	// 				});
	// 				// tslint:disable-next-line: max-line-length
	// 				this.invoiceTotal += Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0);
	// 				pos++;
	// 			}
	// 			if (this.invoice.inv_fine_amount && Number(this.invoice.inv_fine_amount > 0)) {
	// 				const element = {
	// 					srno: pos,
	// 					feehead: 'Fine & Penalties',
	// 					feedue: Number(this.invoice.inv_fine_amount),
	// 					concession: 0,
	// 					adjustment: 0,
	// 					netpay: Number(this.invoice.inv_fine_amount),
	// 				};
	// 				this.invoiceTotal += element.netpay;
	// 				this.INVOICE_ELEMENT_DATA.push(element);
	// 			}
	// 			this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	// 		}
	// 	});
	// }
	// getStudentInformation(login_id) {
	// 	this.studentInfo = {};
	// 	this.feeTransactionForm.patchValue({
	// 		'inv_id': [],
	// 		'inv_invoice_no': '',
	// 		'login_id': '',
	// 		'ftr_emod_id': '',
	// 		'ftr_transaction_id': '',
	// 		'ftr_transaction_date': new Date(),
	// 		'ftr_pay_id': '1',
	// 		'ftr_cheque_no': '',
	// 		'ftr_cheque_date': '',
	// 		'ftr_bnk_id': '',
	// 		'ftr_branch': '',
	// 		'ftr_amount': '',
	// 		'ftr_remark': '',
	// 		'is_cheque': '',
	// 		'ftr_deposit_bnk_id': '',
	// 		'saveAndPrint': ''
	// 	});
	// 	this.sisService.getStudentInformation({ au_login_id: login_id, au_status: '1' }).subscribe((result: any) => {
	// 		if (result && result.status === 'ok') {
	// 			this.studentInfo = result.data[0];
	// 			this.selectedMode = '1';
	// 			if (this.studentInfo.last_invoice_number) {
	// 				this.getInvoices(this.studentInfo.last_invoice_number);
	// 			} else {
	// 				this.invoiceArray = [];
	// 				this.INVOICE_ELEMENT_DATA = [];
	// 				this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
	// 				this.selectedMode = '';
	// 			}
	// 		}
	// 	});
	// }
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
	// next(admno) {
	// 	this.loginId = admno;
	// 	if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
	// 		this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
	// 		this.getStudentInformation(this.loginId);
	// 	} else {
	// 		this.getStudentInformation(this.loginId);
	// 	}
	// }
	// prev(admno) {
	// 	this.loginId = admno;
	// 	if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
	// 		this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
	// 		this.getStudentInformation(this.loginId);
	// 	} else {
	// 		this.getStudentInformation(this.loginId);
	// 	}
	// }
	// first(admno) {
	// 	this.loginId = admno;
	// 	if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
	// 		this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
	// 		this.getStudentInformation(this.loginId);
	// 	} else {
	// 		this.getStudentInformation(this.loginId);
	// 	}
	// }
	// last(admno) {
	// 	this.loginId = admno;
	// 	if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
	// 		this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
	// 		this.getStudentInformation(this.loginId);
	// 	} else {
	// 		this.getStudentInformation(this.loginId);
	// 	}
	// }
	// key(admno) {
	// 	this.loginId = admno;
	// 	if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
	// 		this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
	// 		this.getStudentInformation(this.loginId);
	// 	} else {
	// 		this.getStudentInformation(this.loginId);
	// 	}
	// }
	// next2(admno) {
	// 	this.feeLoginId = admno;
	// }
	// prev2(admno) {
	// 	this.feeLoginId = admno;
	// }
	// first2(admno) {
	// 	this.feeLoginId = admno;
	// }
	// last2(admno) {
	// 	this.feeLoginId = admno;
	// }
	// key2(admno) {
	// 	this.feeLoginId = admno;
	// }
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
			'saveAndPrint': false
		});

		this.feeTransactionForm.value.isFamily = true;
		this.feeTransactionForm.value.fam_entry_number = this.familyOutstandingArr['fam_entry_number'];
		this.feeTransactionForm.value.ftr_amount = this.familyOutstandingArr['family_total_outstanding_amt'];
		this.feeTransactionForm.value.ftr_emod_id = this.selectedMode;
		this.feeTransactionForm.value.childData = this.familyOutstandingArr['childData'];


		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.feeTransactionForm.value.fam_entry_number) {
			this.common.showSuccessErrorMessage('Please select a family', 'error');
			validateFlag = false;
		}
		if (Number(this.feeTransactionForm.value.ftr_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}

		if (Number(this.feeTransactionForm.value.ftr_pay_id) === 1) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.ftr_pay_id) === 2) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_bnk_id
				&& this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.ftr_pay_id) === 3) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_deposit_bnk_id
				&& this.feeTransactionForm.value.ftr_remark
				&& this.feeTransactionForm.value.ftr_cheque_date && this.feeTransactionForm.value.ftr_cheque_no
				&& this.feeTransactionForm.value.ftr_branch)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_transaction_id &&
				this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag && this.feeTransactionForm.value.fam_entry_number) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.messsage, 'success');
					this.reset();
					this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
					this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
				}
			});
		}
	}
	saveAndPrint() {
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': true
		});
		this.feeTransactionForm.value.isFamily = true;
		this.feeTransactionForm.value.fam_entry_number = this.familyOutstandingArr['fam_entry_number'];
		this.feeTransactionForm.value.ftr_amount = this.familyOutstandingArr['family_total_outstanding_amt'];
		this.feeTransactionForm.value.ftr_emod_id = this.selectedMode;
		this.feeTransactionForm.value.childData = this.familyOutstandingArr['childData'];
		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;

		if (Number(this.feeTransactionForm.value.ftr_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '1' && !this.feeTransactionForm.value.fam_entry_number) {
			validateFlag = false;
			this.common.showSuccessErrorMessage('Please Choose a Family to Proceed', 'error');
		}
		if (Number(this.feeTransactionForm.value.ftr_pay_id) === 1) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_amount && this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.ftr_pay_id) === 2) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_amount && this.feeTransactionForm.value.ftr_bnk_id
				&& this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		} else if (Number(this.feeTransactionForm.value.ftr_pay_id) === 3) {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_amount && this.feeTransactionForm.value.ftr_bnk_id
				&& this.feeTransactionForm.value.ftr_remark
				&& this.feeTransactionForm.value.ftr_cheque_date && this.feeTransactionForm.value.ftr_cheque_no
				&& this.feeTransactionForm.value.ftr_branch)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_amount && this.feeTransactionForm.value.ftr_transaction_id &&
				this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
			this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					const length = result.data.split('/').length;
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.reset();
				} else {
					this.reset();
					this.common.showSuccessErrorMessage(result.messsage, 'error');
				}
			});
		}
	}
	// gotoIndividual($event) {
	// 	if (!($event.checked)) {
	// 		this.router.navigate(['../fee-transaction-entry-bulk'], { relativeTo: this.route });
	// 	}
	// }
	getSelectedMode($event) {
		this.selectedMode = $event.value;
		if (this.selectedMode !== '1') {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.familyOutstandingArr['family_total_outstanding_amt'],
			});
		} else {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.familyOutstandingArr['family_total_outstanding_amt']
			});
		}
	}

	reset() {
		this.feeTransactionForm.patchValue({
			'inv_id': [],
			'inv_invoice_no': '',
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
			'saveAndPrint': ''
		});
	}

	// openDialog(invoiceNo, edit): void {
	// 	const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
	// 		width: '80%',
	// 		data: {
	// 			inv_invoice_no: invoiceNo,
	// 			edit: edit,
	// 			paidStatus: 'paid'
	// 		},
	// 		hasBackdrop: true
	// 	});

	// 	dialogRef.afterClosed().subscribe(result2 => {
	// 		const invDet: any = this.studentRouteMoveStoreService.getInvoiceId();
	// 		if (!(invDet.inv_id)) {
	// 			this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
	// 				if (data.adm_no && data.login_id) {
	// 					this.lastRecordId = data.adm_no;
	// 					this.loginId = data.adm_no;
	// 					this.feeLoginId = data.login_id;
	// 					this.getStudentInformation(this.lastRecordId);
	// 				} else {
	// 					this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
	// 						if (result.status === 'ok') {
	// 							this.lastRecordId = result.data[0].last_record;
	// 							this.loginId = result.data[0].au_login_id;
	// 							this.feeLoginId = this.loginId;
	// 							this.getStudentInformation(this.lastRecordId);
	// 						}
	// 					});
	// 				}

	// 			});
	// 		} else {
	// 			const invDet2: any = this.studentRouteMoveStoreService.getInvoiceId();
	// 			this.lastRecordId = invDet2.au_admission_no;
	// 			this.loginId = invDet2.login_id;
	// 			this.feeLoginId = this.loginId;
	// 			this.studentInfo = {};
	// 			this.feeTransactionForm.patchValue({
	// 				'inv_id': [],
	// 				'login_id': '',
	// 				'inv_invoice_no': '',
	// 				'ftr_emod_id': '',
	// 				'ftr_transaction_id': '',
	// 				'ftr_transaction_date': new Date(),
	// 				'ftr_pay_id': '1',
	// 				'ftr_cheque_no': '',
	// 				'ftr_cheque_date': '',
	// 				'ftr_bnk_id': '',
	// 				'ftr_branch': '',
	// 				'ftr_amount': '',
	// 				'ftr_remark': '',
	// 				'is_cheque': '',
	// 				'ftr_deposit_bnk_id': '',
	// 				'saveAndPrint': ''
	// 			});
	// 			this.selectedMode = '1';
	// 			this.getInvoices(invDet2.inv_id);
	// 		}

	// 	});
	// }
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	setPayAmount(event) {
		let netAmount = this.familyOutstandingArr['family_total_outstanding_amt'];
		if (event.value === 2 || event.value === '2') {
			if (netAmount < 0) {
				netAmount = 0;
			}

			this.feeTransactionForm.patchValue({
				'ftr_amount': netAmount,
				'ftr_pay_id': event.value
			});
		} else {
			this.feeTransactionForm.patchValue({
				'ftr_amount': netAmount,
				'ftr_pay_id': event.value
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

	backToFamilyInformation(familyEntryNumber) {
		this.common.setFamilyInformation(familyEntryNumber);
		this.router.navigate(['../family-information'], { relativeTo: this.route });
	}
}
