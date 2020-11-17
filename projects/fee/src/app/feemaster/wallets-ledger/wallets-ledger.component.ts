import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
import { SelectionModel } from '@angular/cdk/collections';
import { WalletReceiptDetailsModalComponent } from '../../sharedmodule/wallet-receipt-details-modal/wallet-receipt-details-modal.component';


@Component({
  selector: 'app-wallets-ledger',
  templateUrl: './wallets-ledger.component.html',
  styleUrls: ['./wallets-ledger.component.css']
})
export class WalletsLedgerComponent implements OnInit {
  @ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
  displayedColumns: string[] = ['w_rpt_no', 'w_transaction_date', 'w_amount'
  //, 'w_amount_type'
  	// , 'w_pay_id', 'w_cheque_no', 'w_cheque_date', 'w_bnk_id', 'w_branch', 'w_transaction_id', 'w_remarks'
	];
	ELEMENT_DATA: Element[] = [];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	selectedMode: any;
	lastRecordId;
	loginId: any;
	feeLoginId: any;
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
  sessionArray: any[] = [];
  session: any;
  sessionName: any;
  session_id: any;
  selection = new SelectionModel<Element>(true, []);
  footerRecord: any = {
		balancetotal: 0,
		balancetype:''
  };
  recordArray: any[] = [];
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
	) { 
    this.session_id = JSON.parse(localStorage.getItem('session'));
  }

	ngOnInit() {
		this.invoiceArray = [];
		this.invoice = {};
		this.selectedMode = '';
		this.getSchool();
		this.getSession();
		this.selectedMode = '';
		const invDet: any = this.studentRouteMoveStoreService.getInvoiceId();
		if (!(invDet.inv_id)) {
			this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
				if (data.adm_no && data.login_id) {
					this.lastRecordId = data.adm_no;
					this.loginId = data.adm_no;
					this.feeLoginId = data.login_id;
					this.getWallets(this.lastRecordId);
				} else {
					this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
						if (result.status === 'ok') {
							this.lastRecordId = result.data[0].last_record;
							this.loginId = result.data[0].au_login_id;
							this.feeLoginId = this.loginId;
							this.getWallets(this.lastRecordId);
						}
					});
				}

			});
		}
	}
	buildForm() {
  }
  getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session_id.ses_id];
					}
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
					this.getWallets(this.lastRecordId);
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
  getWallets(login_id) {
    this.recordArray=[];
		this.selection.clear();
		let element: any = {};
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.feeService.getWallets({ login_id: this.feeLoginId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
        this.recordArray=result.data;
				let pos = 1;
				this.footerRecord = {
					balancetotal: 0,
					balancetype:''
        };
        let total_credit = 0;
        let total_debit = 0;
		for (const item of this.recordArray) {
			element = {
				w_transaction_date: item.w_transaction_date,
				w_rpt_no: item.w_rpt_no ? item.w_rpt_no : '-',
				w_remarks: item.w_remarks ? item.w_remarks : '-',
				w_amount: item.w_amount ? item.w_amount : '0',
				w_amount_type: item.w_amount_type ? item.w_amount_type : '-',
				w_pay_id: item.pay_name ? item.pay_name : '-',
				w_cheque_no: item.w_cheque_no ? item.w_cheque_no : '-',
				w_cheque_date: item.w_cheque_date ? item.w_cheque_date : '-',
							w_bnk_id: item.tb_name_bnk ? item.tb_name_bnk : '-',
				w_branch: item.w_branch ? item.w_branch : '-',
				w_transaction_id: item.w_transaction_id ? item.w_transaction_id : '-'
			};
			if(item.w_pay_id == 3){
				element.w_bnk_id = item.tb_name_deposit ? item.tb_name_deposit : '-';
			}
			if(item.w_amount_type == 'credit'){
				total_credit += parseInt(item.w_amount);
			}
			if(item.w_amount_type == 'debit'){
				total_debit += parseInt(item.w_amount);
			}
			this.ELEMENT_DATA.push(element);
			pos++;
		}
		this.footerRecord.balancetotal = total_credit - total_debit;
		if(this.footerRecord.balancetotal > 0) {
			this.footerRecord.balancetype = '+';
		} else if(this.footerRecord.balancetotal < 0) {
			this.footerRecord.balancetype = '-';
		}
		this.commonStu.wallet_balance = this.footerRecord.balancetotal;
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				console.log('this.ELEMENT_DATA',this.ELEMENT_DATA);
				
				
			} else {
				this.common.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	getStudentInformation(login_id) {
		this.studentInfo = {};
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
	next(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	prev(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	first(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	last(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
		}
	}
	key(admno) {
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.type = this.studentRouteMoveStoreService.getProcessTypePrev();
			this.getWallets(this.loginId);
		} else {
			this.getWallets(this.loginId);
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
	isExist(mod_id) {
		return this.common.isExistUserAccessMenu(mod_id);
	}
	checkStatus() {
		if (this.commonStu.studentdetails.editable_status === '1') {
			return true;
		} else {
			return false;
		}
  }
  openReceiptDialog(rpt_id, edit): void {
		const dialogRef = this.dialog.open(WalletReceiptDetailsModalComponent, {
			width: '80%',
			data: {
        rpt_id: rpt_id,
        admission_id:this.loginId,
				edit: edit
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}
	ngOnDestroy() {
		this.studentRouteMoveStoreService.setInvoiceId({});
	}

}

export interface Element {
	w_rpt_no: number;
	w_transaction_date: string;
	w_amount: number;
	w_amount_type: string;
	w_pay_id: string;
  w_cheque_no: string;
  w_bnk_id: string;
  w_branch: string;
  w_transaction_id: string;
  w_remarks: string;
  w_cheque_date:string;
}
