import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
import { SelectionModel } from '@angular/cdk/collections';
import { WalletReceiptDetailsModalComponent } from '../../sharedmodule/wallet-receipt-details-modal/wallet-receipt-details-modal.component';
import { BillDetailsModalComponent } from '../../sharedmodule/bill-details-modal/bill-details-modal.component';
import { TitleCasePipe, DatePipe } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs'; 


@Component({
  selector: 'app-wallets-ledger',
  templateUrl: './wallets-ledger.component.html',
  styleUrls: ['./wallets-ledger.component.css']
})
export class WalletsLedgerComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	@ViewChild('billDetailsModal') billDetailsModal;
  	@ViewChild(CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
  displayedColumns: string[] = ['w_rpt_no', 'w_transaction_date','particulars', 'w_amount','action'
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
  locationArray: any[] = [];

	currentUser: any;
	length: any;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
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
		this.getLocation();
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
					//this.getWallets(this.lastRecordId);
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
	getLocationName(location_id) {
		if(location_id && this.locationArray.length > 0) {
			for (const item of this.locationArray) {
				if (Number(item.location_id) === Number(location_id)) {
					return item.location_hierarchy;
				}
			}
		} else {
			return '';
		}
		
	}
	getLocation() {
		var inputJson = {};
		this.feeService.getLocation(inputJson).subscribe((result: any) => {
		if (result) {
			this.locationArray = result;
		} else {
			this.locationArray = [];
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
				particulars:'',
				subparticulars:'',
				w_transaction_date: new DatePipe('en-in').transform(item.w_transaction_date,'d-MMM-y'),
				w_rpt_no: item.w_rpt_no && item.w_rpt_no != 0 ? item.w_rpt_no : '',
				rpt_type:'',
				w_remarks: item.w_remarks ? item.w_remarks : '',
				w_amount: item.w_amount ? item.w_amount : '0',
				w_amount_type: item.w_amount_type ? item.w_amount_type : '-',
				w_amount_sign: item.w_amount_type == 'credit' ?  '+': '-',
				w_pay_id: item.pay_name ? item.pay_name : '-',
				w_cheque_no: item.w_cheque_no ? item.w_cheque_no : '-',
				w_cheque_date: item.w_cheque_date ? item.w_cheque_date : '-',
							w_bnk_id: item.tb_name_bnk ? item.tb_name_bnk : '-',
				w_branch: item.w_branch ? item.w_branch : '-',
				w_transaction_id: item.w_transaction_id ? item.w_transaction_id : '-',
				w_opening: item.w_opening,
				w_amount_status:item.w_amount_status,
				action:item
			};
			if(item.w_pay_id == 3){
				element.w_bnk_id = item.tb_name_deposit ? item.tb_name_deposit : '-';
			}
			if(item.w_amount_status == 'deposit'){
				total_credit += parseInt(item.w_amount);
				element.rpt_type = 'RPT';
				element.particulars='Amount Received';
				element.subparticulars = item.pay_name ? '(By '+item.pay_name+')':'';
			} else if(item.w_amount_status == 'withdrawal'){
				total_debit += parseInt(item.w_amount);
				element.w_rpt_no = item.w_rpt_no
				element.rpt_type = 'BIL';
				element.particulars='Withdrawal';
				element.subparticulars = item.pay_name ? '(By '+item.pay_name+')':'';
			} else if(item.w_amount_status == 'purchase'){
				total_debit += parseInt(item.w_amount);
				element.w_rpt_no = item.w_ref_id
				element.rpt_type = 'BIL';
				element.particulars=this.getLocationName(item.w_ref_location_id);
				element.subparticulars = item.w_ref_no_of_items ? '(No of items - '+item.w_ref_no_of_items+')' : '';
			}
			if(item.w_opening == 1){
				if(item.w_amount_type == 'credit') {
					total_credit += parseInt(item.w_amount);
				} else if(item.w_amount_type == 'debit') {
					total_debit += parseInt(item.w_amount);
				}
				element.w_rpt_no='';
				element.particulars = 'Opening Balance';
				element.subparticulars = '';
			}
			this.ELEMENT_DATA.push(element);
			pos++;
		}
		this.footerRecord.balancetotal = total_credit - total_debit;
		if(this.footerRecord.balancetotal > 0) {
			this.footerRecord.balancetype = '+';
		} else if(this.footerRecord.balancetotal < 0) {
			this.footerRecord.balancetype = '';
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
  openReceiptDialog(element, edit): void {
	  if(element.w_amount_status == 'deposit' || element.w_amount_status == 'withdrawal') {
		const dialogRef = this.dialog.open(WalletReceiptDetailsModalComponent, {
			width: '80%',
			data: {
        rpt_id: element.w_rpt_no,
        admission_id:this.loginId,
				edit: edit
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	  } else if(element.w_amount_status == 'purchase') {
		  this.feeService.allStoreBill({bill_no:parseInt(element.w_rpt_no)}).subscribe((result:any) => {
			  if(result && result.length > 0) {
				this.billDetailsModal.openModal(result[result.length-1]);

			  }
		  } )
	  }
	  console.log(element);
		
	}
	ngOnDestroy() {
		this.studentRouteMoveStoreService.setInvoiceId({});
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		
		columns.push({
			key: 'w_rpt_no',
			width: this.checkWidth('w_rpt_no', 'Txn Id')
		});
		columns.push({
			key: 'w_transaction_date',
			width: this.checkWidth('w_transaction_date', 'Date')
		});
		columns.push({
			key: 'particulars',
			width: this.checkWidth('particulars', 'Particulars')
		});
		
		columns.push({
			key: 'w_amount',
			width: this.checkWidth('w_amount', 'Amount')
		});
		reportType = new TitleCasePipe().transform('wallet_ledger_report: ' + this.sessionName+'_'+this.commonStu.studentdetails.au_full_name+'_'+this.commonStu.studentdetails.em_admission_no);
		reportType2 = new TitleCasePipe().transform('wallet ledger report: ' + this.sessionName+'_'+this.commonStu.studentdetails.au_full_name+'_'+this.commonStu.studentdetails.em_admission_no);

		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType2;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:' + this.alphabetJSON[7] + '3');
		worksheet.getCell('A3').value = this.commonStu.studentdetails.au_full_name + '(' +
			this.commonStu.studentdetails.em_admission_no + ')';
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A4:' + this.alphabetJSON[7] + '4');
		worksheet.getCell('A4').value = 'Class : ' + this.commonStu.studentdetails.class_name + ' ' +
			this.commonStu.studentdetails.sec_name;
		worksheet.getCell(`A4`).alignment = { horizontal: 'left' };
		worksheet.getCell('A6').value = 'Txn Id';
		worksheet.getCell('B6').value = 'Date';
		worksheet.getCell('C6').value = 'Particulars';
		worksheet.getCell('D6').value = 'Amount';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.ELEMENT_DATA) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.w_rpt_no;
			worksheet.getCell('B' + this.length).value = dety.w_transaction_date;
			worksheet.getCell('C' + this.length).value = dety.particulars+ (dety.subparticulars ? '-'+dety.subparticulars : '');
			worksheet.getCell('D' + this.length).value = dety.w_amount_sign+dety.w_amount;
			worksheet.addRow(obj);
		}

		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 6) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum > 6 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});

		const obj3: any = {};
		obj3['w_rpt_no'] = 'Total';
		obj3['w_transaction_date'] = '';
		obj3['particulars'] = '';
		obj3['w_amount'] = this.footerRecord.balancetype+this.footerRecord.balancetotal;
		worksheet.addRow(obj3);
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
		});
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	checkWidth(id, header) {
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	deleteInvoiceFinal(value) {
		console.log(value);
		if(value.reason_id && value.reason_remark) {
			const param:any = {};
			param.w_reason_id = value.reason_id;
			param.w_reason_remark = value.reason_remark;
			param.w_id = value.inv_id.action.w_id;
			param.w_status = '5';
			this.feeService.updateWalletStatus(param).subscribe((result:any) => {
				if(result && result.status == 'ok') {
					this.common.showSuccessErrorMessage(result.data,'success');
					this.getWallets(this.loginId);
				} else {
					this.common.showSuccessErrorMessage(result.data,'error');
				}
			})
		}
	}
	deleteConfirm(value) {
		this.deleteWithReasonModal.openModal(value);
	}

}

export interface Element {
	w_rpt_no: number;
	rpt_type: string;
	w_transaction_date: string;
	w_amount: number;
	w_amount_type: string;
	w_amount_status: string;
	w_amount_sign:string;
	w_pay_id: string;
  w_cheque_no: string;
  w_bnk_id: string;
  w_branch: string;
  w_transaction_id: string;
  w_remarks: string;
  w_cheque_date:string;
  w_opening:number;
  particulars:string;
  subparticulars:string;
}
