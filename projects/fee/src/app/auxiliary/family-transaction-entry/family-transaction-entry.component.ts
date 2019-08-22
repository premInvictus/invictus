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
	familyOutstandingArr: any;
	// studentInfo: any = {};
	invoiceTotal: any;
	defaultsrc = '';
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
	epd_parent_name: any[];
	epd_contact_no: any[];
	fam_family_name: any[];
	fam_entry_number: any[];
	fam_created_date: any[];
	family_total_outstanding_amt: any[];
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
		this.selectedMode = '1';
		const invDet: any = this.studentRouteMoveStoreService.getInvoiceId();



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
		// this.feeTransactionForm.patchValue({
		// 	'ftr_emod_id': '',
		// 	'ftr_transaction_id': '',
		// 	'ftr_transaction_date': new Date(),
		// 	'ftr_pay_id': '1',
		// 	'ftr_cheque_no': '',
		// 	'ftr_cheque_date': '',
		// 	'ftr_bnk_id': '',
		// 	'ftr_branch': '',
		// 	'ftr_amount': '',
		// 	'ftr_remark': '',
		// 	'is_cheque': '',
		// 	'ftr_deposit_bnk_id': '',
		// 	'saveAndPrint': ''
		// });
		// this.selectedMode = '1';
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

		// this.selectedMode = '1';

		const familyData = this.common.getSelectedChildData();
		if (familyData) {
			console.log('family number', familyData);
			this.getFamilyOutstandingDetail(familyData);
		} else {
			this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
		}
	}

	getFamilyOutstandingDetail(familyData) {

		this.familyOutstandingArr = familyData;
		for (let i = 0; i < familyData.childData.length; i++) {
			if (familyData.childData[i]) {
				this.childDataArr.push(familyData.childData[i]);
			}
		}

		// this.childDataArr = familyData.childData;
		console.log('child final data', this.childDataArr);
		this.getSelectedMode({ value: '1' });
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
		// this.feeTransactionForm.value.ftr_amount = this.familyOutstandingArr['family_total_outstanding_amt'];
		this.feeTransactionForm.value.ftr_emod_id = this.selectedMode;
		this.feeTransactionForm.value.childData = this.childDataArr;


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
					// this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
				} else {
					this.common.showSuccessErrorMessage(result.messsage, 'error');
					this.reset();
					// this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
					this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
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
		// this.feeTransactionForm.value.ftr_amount = this.familyOutstandingArr['family_total_outstanding_amt'];
		this.feeTransactionForm.value.ftr_emod_id = this.selectedMode;
		this.feeTransactionForm.value.childData = this.childDataArr;
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
