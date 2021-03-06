import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InvoiceElement } from './invoiceelement.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
@Component({
	selector: 'app-fee-transaction-entry',
	templateUrl: './fee-transaction-entry.component.html',
	styleUrls: ['./fee-transaction-entry.component.scss']
})
export class FeeTransactionEntryComponent implements OnInit, OnDestroy {
	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
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
	tempentryModes: any[] = [];
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
	invoiceArrayForm: any[] = [];
	walletProcess: any[] = ['deposit', 'withdrawal'];
	opening_balance_paid_status = 0;
	bnk_charge = 0;
	bnk_charge_per = 0;
	readonlymodeforinvoice = false;
	processingPayment: boolean = false;
	footerRecord: any;
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
					this.getPocketBalance(data.login_id);
					this.lastRecordId = data.adm_no;
					this.loginId = data.adm_no;
					this.feeLoginId = data.login_id;
					this.getStudentInformation(this.lastRecordId);
				} else {
					this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
						if (result.status === 'ok') {
							this.lastRecordId = result.data[0].last_record;
							this.loginId = result.data[0].au_login_id;
							this.getPocketBalance(this.loginId);
							this.feeLoginId = this.loginId;
							this.getStudentInformation(this.lastRecordId);
						}
					});
				}

			});
		} else {
			const invDet2: any = this.studentRouteMoveStoreService.getInvoiceId();
			this.lastRecordId = invDet2.au_admission_no;
			this.loginId = invDet2.login_id;
			this.feeLoginId = this.loginId;
			this.getPocketBalance(this.loginId);
			this.studentInfo = {};
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
				'saveAndPrint': '',
				'walletProcess': ''
			});
			this.selectedMode = '1';
			this.readonlymodeforinvoice = true;
			this.currentInvoiceId = invDet2.inv_id;
			this.getInvoices(invDet2.inv_id);
		}
	}
	getPocketBalance(login_id) {
		this.footerRecord = {
			balancetotal: 0,
			balancetype: ''
		};
		this.feeService.getWallets({ login_id: login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const recordArray = result.data;
				console.log('recordArray in common', recordArray);
				let total_credit = 0;
				let total_debit = 0;
				for (const item of recordArray) {
					if (item.w_amount_type == 'credit') {
						total_credit += parseInt(item.w_amount);
					} else if (item.w_amount_type == 'debit') {
						total_debit += parseInt(item.w_amount);
					}
				}
				this.footerRecord.balancetotal = total_credit - total_debit;
				console.log("---------------------------", this.footerRecord);

				if (this.footerRecord.balancetotal > 0) {
					this.footerRecord.balancetype = '+';
				} else if (this.footerRecord.balancetotal < 0) {
					this.footerRecord.balancetype = '';
				}
				console.log("---------------------------", this.footerRecord);
			}
		});
	}
	addBankCharge(event) {
		this.removeBankCharge();
		if (this.feeTransactionForm.value.ftr_pay_id === '4') {
			const bnk = this.banks.find(e => e.bnk_id == event.value);
			if (bnk) {
				const bnk_charge = JSON.parse(bnk.bnk_charge);
				let bnkcharge = 0;
				if (bnk_charge && bnk_charge.length > 0) {
					for (let i = 0; i < bnk_charge.length; i++) {
						const element = bnk_charge[i];
						if (this.invoice.netPay >= element.bnk_charge_start && this.invoice.netPay <= element.bnk_charge_end) {
							bnkcharge = element.bnk_charge;
							break;
						}
					}
				}
				this.bnk_charge = this.invoice.netPay * bnkcharge / 100;
				this.bnk_charge = Math.round(this.bnk_charge);
				this.bnk_charge_per = bnkcharge;
			} else {
				this.removeBankCharge();
			}
		}
		this.setBankCharge(this.bnk_charge)
		console.log(this.bnk_charge);
	}
	setBankCharge(bnk_charge) {
		this.invoice.netPay += bnk_charge;
		this.feeTransactionForm.patchValue({
			ftr_amount: this.invoice.netPay
		});
		this.invoiceTotal = this.invoice.netPay;
	}
	removeBankCharge() {
		this.invoice.netPay -= this.bnk_charge;
		this.feeTransactionForm.patchValue({
			ftr_amount: this.invoice.netPay
		});
		this.invoiceTotal = this.invoice.netPay;
		this.bnk_charge = 0;
		this.bnk_charge_per = 0;
	}
	buildForm() {
		this.feeTransactionForm = this.fbuild.group({
			'inv_id': [],
			'login_id': '',
			'inv_invoice_no': '',
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
			'saveAndPrint': '',
			'walletProcess': '',
			'ftr_actual_amount': ''
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
	getInvoices(inv_number) {
		this.bnk_charge = 0;
		const datePipe = new DatePipe('en-in');
		this.INVOICE_ELEMENT_DATA = [];
		this.invoiceArrayForm = [];
		this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
		this.invoiceArray = [];
		const invoiceJSON: any = {
			inv_id: inv_number,
			ftr_transaction_date: datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd')
		};
		if (inv_number) {
			this.feeService.getInvoiceBifurcation(invoiceJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {

					this.INVOICE_ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
					this.invoice = {};
					this.invoice = result.data[0];

					this.invoice.netPay = this.invoice.late_fine_amt ?
						Number(this.invoice.late_fine_amt) + Number(this.invoice.fee_amount) :
						Number(this.invoice.fee_amount);


					if (this.invoice.balance_amt) {
						console.log("i am here ", this.invoice.balance_amt);

						this.invoice.balance_amt = Number(this.invoice.balance_amt);
						this.invoice.netPay += this.invoice.balance_amt;
						// this.invoice.netPay += Number(this.invoice.balance_amt);
					}
					// if (this.invoice.prev_balance) {
					// 	this.invoice.netPay += Number(this.invoice.prev_balance);
					// 	this.invoice.balance_amt += Number(this.invoice.prev_balance);
					// }

					if (this.invoice.netPay < 0) {
						this.invoice.netPay = 0;
					}



					this.invoiceArray = this.invoice.invoice_bifurcation;



					this.feeTransactionForm.patchValue({
						'ftr_amount': this.invoice.netPay,
						'ftr_emod_id': this.invoiceArray.length > 0 && this.selectedMode === '1' ? this.selectedMode : '',
					});
					let pos = 1;

					// if (this.invoice.inv_prev_balance && Number(this.invoice.inv_prev_balance) !== 0) {
					// 	// const element = {
					// 	// 	srno: pos,
					// 	// 	feehead: 'Previous Balance',
					// 	// 	feedue: Number(this.invoice.inv_prev_balance),
					// 	// 	concession: 0,
					// 	// 	adjustment: 0,
					// 	// 	netpay: Number(this.invoice.inv_prev_balance)
					// 	// };
					// 	// this.invoiceTotal += element.netpay;
					// 	// this.INVOICE_ELEMENT_DATA.push(element);
					// 	// var fb = this.fbuild.group({	
					// 	// 	rm_inv_id:'',
					// 	// 	rm_head_type:'',
					// 	// 	rm_fm_id:'',
					// 	// 	rm_fh_id:'',
					// 	// 	rm_fh_name:'',
					// 	// 	rm_fh_amount:'',
					// 	// 	rm_fcc_id:'',
					// 	// 	rm_fcc_name:'',
					// 	// 	rm_fcc_amount:'',
					// 	// 	rm_adj_amount:'',
					// 	// 	rm_total_amount:'',


					// 	// 	netpay:Number(this.invoice.inv_prev_balance),
					// 	// 	feehead: 'Previous Balance'
					// 	// });
					// 	// this.invoiceArrayForm.push(fb);
					// 	pos++;
					// }
					this.invoiceTotal = 0;
					let arr = [];
					for (const item of this.invoiceArray) {
						if (Number(item.head_bal_amount) != 0) {
							this.INVOICE_ELEMENT_DATA.push({
								srno: pos,
								feehead: item.invg_fh_name,
								feedue: item.invg_fh_amount,
								concession: item.invg_fcc_amount,
								adjustment: item.invg_adj_amount,
								// tslint:disable-next-line: max-line-length
								// netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
								netpay: Number(item.head_bal_amount)
							});
						}
						// tslint:disable-next-line: max-line-length
						if (item.head_bal_amount && Number(item.head_bal_amount) != 0 && item.invg_fh_name != 'Previous Received Amt.') {
							var fb = this.fbuild.group({
								rm_inv_id: item.invg_inv_id,
								rm_head_type: item.invg_head_type,
								rm_fm_id: item.invg_fm_id,
								rm_fh_id: item.invg_fh_id,
								rm_fh_name: item.invg_fh_name,
								rm_fh_amount: item.invg_fh_amount,
								rm_fcc_id: item.invg_fcc_id,
								rm_fcc_name: item.invg_fcc_name,
								rm_fcc_amount: item.invg_fcc_amount,
								rm_adj_amount: item.invg_adj_amount,
								rm_total_amount: Number(item.head_bal_amount) > 0 ? Number(item.head_bal_amount) : 0,
								// netpay:Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0)
								netpay: Number(item.head_bal_amount)
							});
							this.invoiceArrayForm.push(fb);
							pos++;
							this.invoiceTotal += Number(item.head_bal_amount);
							arr.push(item);
						}





					}
					this.invoiceArray = arr;
					if (this.invoice.inv_fine_amount && Number(this.invoice.inv_fine_amount > 0)) {
						const element = {
							srno: pos,
							feehead: 'Fine & Penalties',
							feedue: Number(this.invoice.inv_fine_amount),
							concession: 0,
							adjustment: 0,
							netpay: Number(this.invoice.inv_fine_amount),
						};
						this.invoiceTotal += element.netpay;
						this.INVOICE_ELEMENT_DATA.push(element);
						var fb = this.fbuild.group({
							rm_inv_id: '',
							rm_head_type: '',
							rm_fm_id: '',
							rm_fh_id: '',
							rm_fh_name: '',
							rm_fh_amount: '',
							rm_fcc_id: '',
							rm_fcc_name: '',
							rm_fcc_amount: '',
							rm_adj_amount: '',
							rm_total_amount: '',
							netpay: Number(this.invoice.inv_fine_amount)
						});
						this.invoiceArrayForm.push(fb);
					}



					if ((this.invoice.netPay - this.invoiceTotal) > 0) {
						this.INVOICE_ELEMENT_DATA[0].netpay += this.invoice.netPay - this.invoiceTotal;
					}
					if ((this.invoice.netPay - this.invoiceTotal) < 0) {
						let catchData = this.invoice.netPay;
						for (let i = this.INVOICE_ELEMENT_DATA.length - 1; i > 0; i--) {
							if (this.INVOICE_ELEMENT_DATA[i].netpay > catchData - this.invoiceTotal) {
								this.INVOICE_ELEMENT_DATA[i].netpay -= (catchData - this.invoiceTotal);
								break;
							} else {
								catchData -= this.INVOICE_ELEMENT_DATA[i].netpay;
								this.INVOICE_ELEMENT_DATA[i].netpay = 0;
							}
						}
					}
					this.dataSource = new MatTableDataSource<InvoiceElement>(this.INVOICE_ELEMENT_DATA);
					this.invoiceArrayForm[0].patchValue({
						netpay: this.invoiceArrayForm[0].value.netpay + (this.invoice.netPay - this.invoiceTotal),
						rm_total_amount: this.invoiceArrayForm[0].value.netpay + (this.invoice.netPay - this.invoiceTotal)
					})
					console.log("i am here", this.invoiceArrayForm[0].value, this.invoice.netPay - this.invoiceTotal, this.invoice.netPay, this.invoiceTotal);
					this.invoiceTotal = this.invoice.netPay;

				}
			});
		}

	}
	async getStudentInformation(login_id) {
		this.bnk_charge = 0;
		this.commonStu.showWalletLedger = false;
		this.studentInfo = {};
		this.entryModes = JSON.parse(JSON.stringify(this.tempentryModes));
		console.log("entry modes >>>>>", this.entryModes);
		
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
			'saveAndPrint': '',
			'walletProcess': ''
		});
		const optedforhostel = 1;
		if (optedforhostel == 1) {
			await this.feeService.getFeeAccount({ accd_login_id: this.feeLoginId }).toPromise().then((result: any) => {
				if (result && result.status === 'ok') {
					const accountdet: any = result.data[0];
					console.log("i ma here", accountdet);

					if (accountdet.accd_is_hostel == 'Y') {
						this.commonStu.showWalletLedger = true;
					} else {

						const findex = this.entryModes.findIndex(e => e.emod_alias == 'EAW');
						const nindex = this.payModes.findIndex(e => e.pay_name == 'Wallet');
						// if(findex != -1) {
						// 	this.entryModes.splice(findex,1);
						// }
						// if(nindex != -1) {
						// 	this.payModes.splice(nindex,1);
						// }
					}
				}
			});
		}
		this.sisService.getStudentInformation({ au_login_id: login_id, au_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.studentInfo = result.data[0];
				this.opening_balance_paid_status = result.data[0]['opening_balance_paid_status'];
				for (var i = 0; i < this.entryModes.length; i++) {
					if (Number(this.opening_balance_paid_status)) {
						if (this.entryModes[i]['emod_alias'] == 'AOB') {
							this.entryModes.splice(i, 1);
						}
					}
					if (!(Number(this.opening_balance_paid_status)) && this.studentInfo.student_opening_balance == 0) {
						if (this.entryModes[i]['emod_alias'] == 'AOB') {
							this.entryModes.splice(i, 1);
						}
					}

				}
				this.selectedMode = '1';
				this.readonlymodeforinvoice = true;
				if (this.studentInfo.last_invoice_number) {
					this.currentInvoiceId = this.studentInfo.last_invoice_number;
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

	recaluclateInvoice(event) {
		// 'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
		this.getInvoices(this.currentInvoiceId);
	}
	getEntryModes() {
		this.feeService.getEntryMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.entryModes = result.data;
				this.tempentryModes = JSON.parse(JSON.stringify(result.data));
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
				for (var i = 0; i < result.data.length; i++) {
					if ((!(result.data[i]['bnk_module_list'] == '')) || (result.data[i]['bnk_module_list'].includes('fees'))) {
						this.banks.push(result.data[i]);
					}
				}

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
		this.processingPayment = true;
		const datePipe = new DatePipe('en-in');
		this.feeTransactionForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': false
		});
		if (this.invoice.late_fine_amt) {
			this.feeTransactionForm.value.lateFeeAmt = this.invoice.late_fine_amt;
		}
		if (this.invoice.balance_amt) {
			this.feeTransactionForm.value.ftr_prev_balance = this.invoice.balance_amt;
		}
		this.feeTransactionForm.value.login_id = this.feeLoginId;
		this.feeTransactionForm.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm.value.inv_invoice_no = [this.invoice.inv_invoice_no];
		this.feeTransactionForm.value.is_cheque = this.feeTransactionForm.value.ftr_pay_id === '3' ? true : false;
		let validateFlag = true;
		if (!this.loginId) {
			this.common.showSuccessErrorMessage('Please select a student', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '1' && Number(this.invoice.fee_amount) === 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '2' && Number(this.feeTransactionForm.value.ftr_amount) <= 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '4' && Number(this.feeTransactionForm.value.ftr_amount) <= 0) {
			this.common.showSuccessErrorMessage('Zero Amount Entry not possible', 'error');
			validateFlag = false;
		}
		if (this.selectedMode === '1' && this.invoiceArray.length === 0) {
			validateFlag = false;
			this.common.showSuccessErrorMessage('Invoice Number cannot be blank for against invoice', 'error');
		}
		// if(this.selectedMode == '5' && (Number(this.studentInfo.student_opening_balance) != this.feeTransactionForm.value.ftr_amount)) {
		// 	validateFlag = false;
		// 	this.common.showSuccessErrorMessage('Transaction Amount should match with Opening Balance Amount', 'error');
		// }
		if (Number(this.feeTransactionForm.value.ftr_pay_id) === 1 || Number(this.feeTransactionForm.value.ftr_pay_id) === 7) {
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
				this.feeTransactionForm.value.ftr_bnk_id
				&& this.feeTransactionForm.value.ftr_remark
				&& this.feeTransactionForm.value.ftr_cheque_date && this.feeTransactionForm.value.ftr_cheque_no)) {
				validateFlag = false;
			}
		} else {
			if (!(this.feeTransactionForm.value.ftr_pay_id &&
				this.feeTransactionForm.value.ftr_transaction_id &&
				this.feeTransactionForm.value.ftr_remark)) {
				validateFlag = false;
			}
		}
		if (validateFlag) {
			this.btnDisable = true;
			console.log("i am selected mod", this.selectedMode, this.feeTransactionForm.value.ftr_pay_id);

			if (this.selectedMode === '4' || (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {
				console.log("i am in here1");

				if (this.feeTransactionForm.value.walletProcess || (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {
					let inputjson: any = this.feeTransactionForm.value;
					console.log("i am in here2", inputjson);
					if (this.feeTransactionForm.value.walletProcess == 'deposit') {
						inputjson.ftr_amount_type = 'credit';
					} else if (this.feeTransactionForm.value.walletProcess == 'withdrawal') {
						inputjson.ftr_amount_type = 'debit';
					} else if (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7') {
						inputjson.ftr_amount_type = 'debit';
					}
					if (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7') {
						inputjson.ftr_amount_status = 'withdrawal';
						inputjson.ftr_remark = 'Against Invoice - ' + inputjson.inv_invoice_no[0];
					} else {
						inputjson.ftr_amount_status = this.feeTransactionForm.value.walletProcess;
					}



					let receiptMappArr = [];
					for (var i = 0; i < this.invoiceArrayForm.length; i++) {
						if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
							receiptMappArr.push({
								rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
								rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
								rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
								rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
								rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
								rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
								rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
								rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
								rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
								rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
								rm_total_amount: this.invoiceArrayForm[i].value.netpay,
							})
						}
					}
					inputjson.receipt_mapping = receiptMappArr;
					console.log("i amhere", inputjson);

					this.feeService.insertWallets(inputjson).subscribe((result: any) => {
						this.btnDisable = false;
						if (result && result.status === 'ok' && !((this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7'))) {
							this.processingPayment = false;
							this.common.showSuccessErrorMessage(result.messsage, 'success');
							this.reset();
							this.getStudentInformation(this.lastRecordId);
							this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
						} else {

							if (!((this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7'))) {
								this.common.showSuccessErrorMessage(result.messsage, 'error');
								this.reset();
								this.getStudentInformation(this.lastRecordId);
								this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
							}
						}
					});
				} else {
					this.common.showSuccessErrorMessage('Please Select Wallet Process', 'error');
					this.btnDisable = false;
				}

			} else {
				let inputjson: any = this.feeTransactionForm.value;
				let receiptMappArr = [];
				for (var i = 0; i < this.invoiceArrayForm.length; i++) {
					if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
						receiptMappArr.push({
							rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
							rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
							rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
							rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
							rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
							rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
							rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
							rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
							rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
							rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
							rm_total_amount: this.invoiceArrayForm[i].value.netpay,
						})
					}
				}
				inputjson.receipt_mapping = receiptMappArr;
				if (this.selectedMode == '5') {
					inputjson.inv_id = [];
					inputjson.inv_invoice_no = [];
					inputjson.inv_process_type = this.studentInfo.au_process_type;
					inputjson.ftr_prev_balance = 0;
					inputjson.lateFeeAmt = 0;
					inputjson.opening_balance_transaction = true;
					inputjson.receipt_mapping = [];
				} else {
					inputjson.opening_balance_transaction = false
				}
				inputjson.ftr_bnk_charge = Math.round(this.bnk_charge);
				inputjson.ftr_bnk_charge_per = Math.round(this.bnk_charge_per);
				inputjson.ftr_amount = this.feeTransactionForm.value.ftr_amount - inputjson.ftr_bnk_charge;
				console.log('inputjson-->', inputjson);
				this.feeService.insertFeeTransaction(inputjson).subscribe((result: any) => {
					this.btnDisable = false;
					this.processingPayment = false;
					if (result && result.status === 'ok') {
						this.common.showSuccessErrorMessage(result.messsage, 'success');
						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					} else {
						if (result.message) {
							this.common.showSuccessErrorMessage(result.message, 'error');
						} else {
							this.common.showSuccessErrorMessage(result.messsage, 'error');
						}

						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					}
				});
			}

			if ((this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {
				let inputjson: any = this.feeTransactionForm.value;
				let receiptMappArr = [];
				for (var i = 0; i < this.invoiceArrayForm.length; i++) {
					if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
						receiptMappArr.push({
							rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
							rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
							rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
							rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
							rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
							rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
							rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
							rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
							rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
							rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
							rm_total_amount: this.invoiceArrayForm[i].value.netpay,
						})
					}
				}
				inputjson.receipt_mapping = receiptMappArr;
				if (this.selectedMode == '5') {
					inputjson.inv_id = [];
					inputjson.inv_invoice_no = [];
					inputjson.inv_process_type = this.studentInfo.au_process_type;
					inputjson.ftr_prev_balance = 0;
					inputjson.lateFeeAmt = 0;
					inputjson.opening_balance_transaction = true;
					inputjson.receipt_mapping = [];
				} else {
					inputjson.opening_balance_transaction = false
				}
				inputjson.ftr_bnk_charge = Math.round(this.bnk_charge);
				inputjson.ftr_bnk_charge_per = Math.round(this.bnk_charge_per);
				inputjson.ftr_amount = this.feeTransactionForm.value.ftr_amount - inputjson.ftr_bnk_charge;
				console.log('inputjson-->', inputjson);
				this.feeService.insertFeeTransaction(inputjson).subscribe((result: any) => {
					this.btnDisable = false;
					if (result && result.status === 'ok') {
						this.processingPayment = false;
						this.common.showSuccessErrorMessage(result.messsage, 'success');
						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					} else {
						if (result.message) {
							this.common.showSuccessErrorMessage(result.message, 'error');
						} else {
							this.common.showSuccessErrorMessage(result.messsage, 'error');
						}

						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					}
				});
			}

		} else {
			this.btnDisable = false;
		}
		this.getPocketBalance(this.loginId);
	}
	saveAndPrint() {
		const datePipe = new DatePipe('en-in');
		if (this.invoice.late_fine_amt) {
			this.feeTransactionForm.value.lateFeeAmt = this.invoice.late_fine_amt;
		}
		if (this.invoice.balance_amt) {
			this.feeTransactionForm.value.ftr_prev_balance = this.invoice.balance_amt;
		}
		this.feeTransactionForm.patchValue({
			'ftr_cheque_date': datePipe.transform(this.feeTransactionForm.value.ftr_cheque_date, 'yyyy-MM-dd'),
			'ftr_transaction_date': datePipe.transform(this.feeTransactionForm.value.ftr_transaction_date, 'yyyy-MM-dd'),
			'saveAndPrint': true
		});
		this.feeTransactionForm.value.login_id = this.feeLoginId;
		this.feeTransactionForm.value.inv_id = [this.invoice.inv_id];
		this.feeTransactionForm.value.inv_invoice_no = [this.invoice.inv_invoice_no];
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
		// if(this.selectedMode == '5' && (Number(this.studentInfo.student_opening_balance) != this.feeTransactionForm.value.ftr_amount)) {
		// 	validateFlag = false;
		// 	this.common.showSuccessErrorMessage('Transaction Amount should match with Opening Balance Amount', 'error');
		// }
		if (this.selectedMode === '1' && this.invoiceArray.length === 0) {
			validateFlag = false;
			this.common.showSuccessErrorMessage('Invoice Number cannot be blank for against invoice', 'error');
		}
		if (Number(this.feeTransactionForm.value.ftr_pay_id) === 1 || Number(this.feeTransactionForm.value.ftr_pay_id) === 7) {
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
				&& this.feeTransactionForm.value.ftr_cheque_date && this.feeTransactionForm.value.ftr_cheque_no)) {
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
			this.btnDisable = true;
			if (this.selectedMode === '4' || (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {
				let inputjson: any = this.feeTransactionForm.value;
				inputjson.ftr_amount_type = 'credit';
				if (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7') {
					inputjson.ftr_amount_type = 'debit';
				}
				if (this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7') {
					inputjson.ftr_amount_status = 'withdrawal';
				}
				let receiptMappArr = [];
				for (var i = 0; i < this.invoiceArrayForm.length; i++) {
					if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
						receiptMappArr.push({
							rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
							rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
							rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
							rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
							rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
							rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
							rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
							rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
							rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
							rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
							rm_total_amount: this.invoiceArrayForm[i].value.netpay,
						})
					}
				}
				inputjson.receipt_mapping = receiptMappArr;
				this.feeService.insertWallets(inputjson).subscribe((result: any) => {
					this.btnDisable = false;
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						window.open(result.data, '_blank');						
						if (!(this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {
							this.common.showSuccessErrorMessage(result.message, 'success');
							console.log('result.data', result.data);
							
							this.reset();
							this.getStudentInformation(this.lastRecordId);
							this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
						}


					} else {
						if (result.message) {
							this.common.showSuccessErrorMessage(result.message, 'error');
						} else {
							this.common.showSuccessErrorMessage(result.messsage, 'error');
						}
						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					}
				});
			} else {
				let inputjson: any = this.feeTransactionForm.value;
				let receiptMappArr = [];
				for (var i = 0; i < this.invoiceArrayForm.length; i++) {
					if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
						receiptMappArr.push({
							rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
							rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
							rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
							rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
							rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
							rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
							rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
							rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
							rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
							rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
							rm_total_amount: this.invoiceArrayForm[i].value.netpay,
						})
					}
				}
				inputjson.receipt_mapping = receiptMappArr;
				if (this.selectedMode == '5') {
					inputjson.inv_id = [];
					inputjson.inv_invoice_no = [];
					inputjson.inv_process_type = this.studentInfo.au_process_type;
					inputjson.ftr_prev_balance = 0;
					inputjson.lateFeeAmt = 0;
					inputjson.receipt_mapping = [];

					inputjson.opening_balance_transaction = true;
				} else {
					inputjson.opening_balance_transaction = false
				}
				this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
					this.btnDisable = false;
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						this.common.showSuccessErrorMessage(result.message, 'success');
						window.open(result.data, '_blank');
						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					} else {
						this.reset();
						if (result.message) {
							this.common.showSuccessErrorMessage(result.message, 'error');
						} else {
							this.common.showSuccessErrorMessage(result.messsage, 'error');
						}
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					}
				});
			}

			if ((this.selectedMode === '1' && this.feeTransactionForm.value.ftr_pay_id == '7')) {

				let inputjson: any = this.feeTransactionForm.value;
				let receiptMappArr = [];
				for (var i = 0; i < this.invoiceArrayForm.length; i++) {
					if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0) {
						receiptMappArr.push({
							rm_inv_id: this.invoiceArrayForm[i].value.rm_inv_id,
							rm_head_type: this.invoiceArrayForm[i].value.rm_head_type,
							rm_fm_id: this.invoiceArrayForm[i].value.rm_fm_id,
							rm_fh_id: this.invoiceArrayForm[i].value.rm_fh_id,
							rm_fh_name: this.invoiceArrayForm[i].value.rm_fh_name,
							rm_fh_amount: this.invoiceArrayForm[i].value.rm_fh_amount,
							rm_fcc_id: this.invoiceArrayForm[i].value.rm_fcc_id,
							rm_fcc_name: this.invoiceArrayForm[i].value.rm_fcc_name,
							rm_fcc_amount: this.invoiceArrayForm[i].value.rm_fcc_amount,
							rm_adj_amount: this.invoiceArrayForm[i].value.rm_adj_amount,
							rm_total_amount: this.invoiceArrayForm[i].value.netpay,
						})
					}
				}
				inputjson.receipt_mapping = receiptMappArr;
				if (this.selectedMode == '5') {
					inputjson.inv_id = [];
					inputjson.inv_invoice_no = [];
					inputjson.inv_process_type = this.studentInfo.au_process_type;
					inputjson.ftr_prev_balance = 0;
					inputjson.lateFeeAmt = 0;
					inputjson.receipt_mapping = [];

					inputjson.opening_balance_transaction = true;
				} else {
					inputjson.opening_balance_transaction = false
				}
				this.feeService.insertFeeTransaction(this.feeTransactionForm.value).subscribe((result: any) => {
					this.btnDisable = false;
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						this.common.showSuccessErrorMessage(result.message, 'success');
						window.open(result.data, '_blank');
						this.reset();
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					} else {
						this.reset();
						if (result.message) {
							this.common.showSuccessErrorMessage(result.message, 'error');
						} else {
							this.common.showSuccessErrorMessage(result.messsage, 'error');
						}
						this.getStudentInformation(this.lastRecordId);
						this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					}
				});
			}

		} else {
			this.btnDisable = false;
		}
	}
	gotoIndividual($event) {
		if (!($event.checked)) {
			this.router.navigate(['../fee-transaction-entry-bulk'], { relativeTo: this.route });
		}
	}
	getSelectedMode($event) {
		this.selectedMode = $event.value;
		console.log("i ma here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", $event.value, $event);
		if ($event.value == '1') {
			this.readonlymodeforinvoice = true;
		} else {
			this.readonlymodeforinvoice = false;
		}

		if (this.selectedMode !== '1') {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.invoice.fee_amount,
			});
		} else {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.invoice.netPay,
			});
		}

		if (this.selectedMode == '5') {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.studentInfo.student_opening_balance,
				'ftr_actual_amount': this.studentInfo.student_opening_balance
			});
		}

		if (this.selectedMode == '4') {
			this.feeTransactionForm.patchValue({
				'ftr_amount': 1
			});
		}
	}

	reset() {
		this.btnDisable = false;
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
			'saveAndPrint': '',
			'ftr_actual_amount': ''
		});
	}

	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				inv_invoice_no: invoiceNo,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result2 => {
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
			} else {
				const invDet2: any = this.studentRouteMoveStoreService.getInvoiceId();
				this.lastRecordId = invDet2.au_admission_no;
				this.loginId = invDet2.login_id;
				this.feeLoginId = this.loginId;
				this.studentInfo = {};
				this.feeTransactionForm.patchValue({
					'inv_id': [],
					'login_id': '',
					'inv_invoice_no': '',
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
				this.readonlymodeforinvoice = true;
				this.getInvoices(invDet2.inv_id);
			}

		});
	}
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	setPayAmount(event) {
		this.feeTransactionForm.patchValue({
			'ftr_bnk_id': ''
		});
		if (event.value === 2 || event.value === '2') {
			// tslint:disable-next-line: max-line-length
			let netAmount = parseInt(this.invoice.fee_amount, 10) + parseInt(this.invoice.inv_fine_amount, 10);

			if (netAmount < 0) {
				netAmount = 0;
			}

			this.feeTransactionForm.patchValue({
				'ftr_amount': netAmount,
				'ftr_pay_id': event.value
			});
		} else if (event.value === 7 || event.value === '7') {
			console.log("i am here", this.footerRecord);
			
			if (this.footerRecord.balancetype == '') {
				this.feeTransactionForm.patchValue({
					'ftr_amount': this.invoice.netPay,
					'ftr_pay_id': '1'
				});
				this.common.showSuccessErrorMessage('Not Enough Balance in Wallet', 'error');
			} else {
				this.feeTransactionForm.patchValue({
					'ftr_amount': this.footerRecord.balancetotal,
					'ftr_pay_id': event.value
				});
				let val = this.footerRecord.balancetotal;
				let changeValue = 0;

				console.log("i am here---------", this.invoiceTotal);

				for (let i = 0; i < this.invoiceArrayForm.length; i++) {

					if (this.invoiceArrayForm[i].value.rm_fh_name != '' && this.invoiceArray[i].head_bal_amount <= val - changeValue) {
						this.invoiceArrayForm[i].patchValue({
							netpay: this.invoiceArray[i].head_bal_amount
						});
						changeValue += this.invoiceArray[i].head_bal_amount;
					} else if (this.invoiceArrayForm[i].value.rm_fh_name != '' && this.invoiceArray[i].head_bal_amount > val - changeValue) {
						this.invoiceArrayForm[i].patchValue({
							netpay: val - changeValue
						});
						changeValue += (val - changeValue);

					}
				}
				this.feeTransactionForm.patchValue({
					'ftr_amount': (changeValue),
					'ftr_pay_id': event.value
				});
				this.invoiceTotal = (changeValue);
				// if (this.invoiceArrayForm.length > 0) {
				// 	this.invoiceArrayForm[0].patchValue({
				// 		netpay: this.invoiceArrayForm[0].value.netpay + (val - changeValue)
				// 	});
				// }
			}

		} else {
			console.log("i am here");

			this.feeTransactionForm.patchValue({
				'ftr_amount': this.invoice.netPay,
				'ftr_pay_id': event.value
			});
		}

		if (this.selectedMode == '5') {
			this.feeTransactionForm.patchValue({
				'ftr_amount': this.studentInfo.student_opening_balance,
				'ftr_pay_id': event.value
			});
		}
		if (event.value !== '4' && event.value !== '7') {
			this.removeBankCharge();
		}
		console.log("i am here---------", this.invoiceTotal);
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

	setNetPay(element, i) {
		console.log(this.invoiceArrayForm);
		this.invoiceTotal = 0;
		// this.invoiceArrayForm[i].patchValue({
		// 	netpay:Number(this.invoiceArrayForm[i].value.feedue)-Number(this.invoiceArrayForm[i].value.concession) - Number(this.invoiceArrayForm[i].value.adjustment)
		// });
		for (let i = 0; i < this.invoiceArrayForm.length; i++) {
			this.invoiceTotal = this.invoiceTotal + Number(this.invoiceArrayForm[i].value.netpay);
			this.invoiceArrayForm[i].patchValue({ rm_total_amount: this.invoiceArrayForm[i].value.netpay });
		}

		this.feeTransactionForm.patchValue({
			ftr_amount: this.invoiceTotal
		})
		if(this.selectedMode == '7' || this.selectedMode == 7) {
			if(this.invoiceTotal > this.footerRecord.balancetotal) {
				this.common.showSuccessErrorMessage('Not Enough Balance in Wallet', 'error');
				this.btnDisable = true
			} else {
				this.btnDisable = false
			}
		}


	}
	changeValue(val) {
		console.log("i am cleed");

		console.log(this.feeTransactionForm.value, val, this.invoiceArrayForm, this.invoiceArray);
		let changeValue = 0;
		this.bnk_charge = 0;
		this.bnk_charge_per = 0;
		if (this.feeTransactionForm.value.ftr_pay_id === '4') {
			const bnk = this.banks.find(e => e.bnk_id == this.feeTransactionForm.value.ftr_bnk_id);

			if (bnk) {
				const bnk_charge = JSON.parse(bnk.bnk_charge);
				let bnkcharge = 0;
				if (bnk_charge && bnk_charge.length > 0) {
					for (let i = 0; i < bnk_charge.length; i++) {
						const element = bnk_charge[i];
						if (val >= element.bnk_charge_start && val <= element.bnk_charge_end) {
							bnkcharge = element.bnk_charge;
						}
					}
				}
				this.bnk_charge = ((val * bnkcharge) / (100 + bnkcharge));
				this.bnk_charge_per = bnkcharge;
				// this.invoice.netPay = this.bnk_charge;
				// this.invoiceTotal = this.invoice.netPay;
			}
			this.bnk_charge = Math.round(this.bnk_charge);
			console.log('bnk_charge', this.bnk_charge);
		} else {
			this.removeBankCharge();
		}
		this.invoiceArrayForm.filter(item => {

			if (item.value.rm_fh_name === '' && item.value.netpay <= val) {
				changeValue += item.value.netpay
			} else if (item.value.rm_fh_name === '' && item.value.netpay > val) {
				changeValue += val;
			}
		});

		for (let i = 0; i < this.invoiceArrayForm.length; i++) {

			if (this.invoiceArrayForm[i].value.rm_fh_name != '' && this.invoiceArray[i].head_bal_amount <= val - changeValue) {
				this.invoiceArrayForm[i].patchValue({
					netpay: this.invoiceArray[i].head_bal_amount
				});
				changeValue += this.invoiceArray[i].head_bal_amount;
			} else if (this.invoiceArrayForm[i].value.rm_fh_name != '' && this.invoiceArray[i].head_bal_amount > val - changeValue) {
				this.invoiceArrayForm[i].patchValue({
					netpay: val - changeValue
				});
				changeValue += (val - changeValue);

			}
		}
		if (this.invoiceArrayForm.length > 0) {
			this.invoiceArrayForm[0].patchValue({
				netpay: this.invoiceArrayForm[0].value.netpay + (val - changeValue)
			});
		}

		this.feeTransactionForm.patchValue({
			ftr_amount: val
		});
		this.invoiceTotal = val;

	}
	getAMount(itotal, prevBal, fineA) {
		return (parseInt(itotal) + parseInt(prevBal) + parseInt(fineA)) > 0 ? (parseInt(itotal) + parseInt(prevBal) + parseInt(fineA)) : 0
	}
}
