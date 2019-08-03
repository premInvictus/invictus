import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeLedgerElement } from './fee-ledger.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';
import { CreateInvoiceModalComponent } from '../../sharedmodule/create-invoice-modal/create-invoice-modal.component';

@Component({
	selector: 'app-fee-ledger',
	templateUrl: './fee-ledger.component.html',
	styleUrls: ['./fee-ledger.component.scss']
})
export class FeeLedgerComponent implements OnInit {
	feeRenderId: any = '';
	@ViewChild(CommonStudentProfileComponent) commonStudentProfileComponent: CommonStudentProfileComponent;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('deleteReceiptModal') deleteReceiptModal;
	@ViewChild('deleteReceiptWithReasonModal') deleteReceiptWithReasonModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('consolidateModal') consolidateModal;
	@ViewChild('unconsolidateModal') unconsolidateModal;
	@ViewChild('detachReceiptModal') detachReceiptModal;
	@ViewChild('searchModal') searchModal;
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	displayedColumns: string[] = ['select', 'feeperiod',  'invoiceno', 'particular', 'date', 'duedate',
		'amount', 'concession', 'adjustment', 'fine','netpayableamount', 'reciept', 'balance', 'receiptdate', 'receiptno', 'mop', 'remarks'];
	FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];
	dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
	selection = new SelectionModel<FeeLedgerElement>(true, []);
	recordArray: any[] = [];
	lastRecordId: any;
	loginId: any;
	footerRecord: any = {
		feeduetotal: 0,
		concessiontotal: 0,
		adjustmenttotal: 0,
		receipttotal: 0,
		finetotal: 0,
		balancetotal: 0
	};
	actionFlag: any = {
		deleteinvoice: false,
		deletereceipt: false,
		edit: false,
		recalculate: false,
		consolidate: false,
		attach: false,
		detach: false,
		unconsolidate: false,
		receiptmodification: false
	};
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('table') table: ElementRef;
	constructor(private sisService: SisService,
		private feeService: FeeService,
		public processtypeService: ProcesstypeFeeService,
		public dialog: MatDialog,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.recordArray = [];
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordId = data.adm_no;
				this.loginId = data.login_id;
				this.recordArray = [];
				this.FEE_LEDGER_ELEMENT = [];
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				this.getFeeLedger(this.loginId);
			} else {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
						this.recordArray = [];
						this.FEE_LEDGER_ELEMENT = [];
						this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
						this.getFeeLedger(this.loginId);
					}
				});
			}

		});
	}
	checkEmit(process_type) {
		if (process_type) {
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				if (result.status === 'ok') {
					this.lastRecordId = result.data[0].last_record;
					this.loginId = result.data[0].au_login_id;
					this.recordArray = [];
					this.FEE_LEDGER_ELEMENT = [];
					this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
					this.getFeeLedger(this.loginId);
				}
			});
		}
	}
	getFeeLedger(login_id) {
		this.selection.clear();
		this.resetActionFlag();
		let element: any = {};
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.feeService.getFeeLedger({ login_id: login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.recordArray = [];
				this.FEE_LEDGER_ELEMENT = [];
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				let pos = 1;
				this.footerRecord = {
					feeduetotal: 0,
					concessiontotal: 0,
					adjustmenttotal: 0,
					netpayabletotal: 0,
					receipttotal: 0,
					finetotal: 0,
					balancetotal: 0
				};
				this.recordArray = result.data;
				for (const item of this.recordArray) {
					const tempactionFlag: any = {
						deleteinvoice: false,
						deletereceipt: false,
						edit: false,
						recalculate: false,
						consolidate: false,
						attach: false,
						detach: false,
						unconsolidate: false,
						receiptmodification: false
					};
					if (item.inv_paid_status === 'paid') {
						if (item.flgr_invoice_receipt_no === '0') {
							tempactionFlag.deletereceipt = true;
						} else {
							tempactionFlag.detach = true;
						}
						tempactionFlag.receiptmodification = true;
					} else if (item.inv_paid_status === 'unpaid') {
						tempactionFlag.deleteinvoice = true;
						tempactionFlag.edit = true;
						tempactionFlag.recalculate = true;
						tempactionFlag.consolidate = true;
						tempactionFlag.attach = true;
						tempactionFlag.unconsolidate = true;
					}

					element = {
						srno: pos,
						date: new DatePipe('en-in').transform(item.flgr_created_date, 'd-MMM-y'),
						invoiceno: item.flgr_invoice_receipt_no ? item.flgr_invoice_receipt_no : '-',
						feeperiod: item.flgr_fp_months ? item.flgr_fp_months : '-',
						particular: item.flgr_particulars ? item.flgr_particulars : '-',
						duedate: item.inv_due_date,
						remarks: item.remarks ? item.remarks : '-',
						amount: item.flgr_amount ? item.flgr_amount : '0',
						concession: item.flgr_concession ? item.flgr_concession : '0',
						adjustment: item.flgr_adj_amount ? item.flgr_adj_amount : '0',
						fine: item.inv_fine_amount ? item.inv_fine_amount : '0',
						reciept: item.flgr_receipt ? item.flgr_receipt : '0',
						balance: item.flgr_balance ? item.flgr_balance : '0',
						receiptdate: item.rpt_receipt_date,
						receiptno: item.rpt_receipt_no,
						mop:  item.mop,
						chqno: item.ftr_cheque_no ? item.ftr_cheque_no : '-',
						chequedate: item.ftr_cheque_date ? item.ftr_cheque_date : '-',
						colorCode: item.color_code ? item.color_code : '',
						// bank: item.tb_name ? item.tb_name : '-',
						netpayableamount : item.net_payable_amount ? item.net_payable_amount : '0',
						eachActionFlag: tempactionFlag,
						action: item
					};
					this.FEE_LEDGER_ELEMENT.push(element);
					pos++;
					this.footerRecord.feeduetotal += Number(element.amount);
					this.footerRecord.concessiontotal += Number(element.concession);
					this.footerRecord.adjustmenttotal += Number(element.adjustment);
					this.footerRecord.receipttotal += Number(element.reciept);
					this.footerRecord.netpayabletotal += Number(element.netpayableamount);
					this.footerRecord.finetotal += Number(element.fine);
					this.footerRecord.balancetotal += Number(element.balance);
				}
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				this.feeRenderId = '';
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
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

	next(admno) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		} else {
			this.getFeeLedger(this.loginId);
		}
	}
	prev(admno) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		}
	}
	first(admno) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		}
	}
	last(admno) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		}
	}
	key(admno) {
		this.FEE_LEDGER_ELEMENT = [];
		this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
		this.loginId = admno;
		if (this.studentRouteMoveStoreService.getProcessTypePrev()) {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
		}
	}
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('fee_ledger')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'FeeLedger_' + this.loginId + '_' + (new Date).getTime() + '.xlsx');

	}
	// to veiw invoice details
	openDialog(item, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: item.flgr_inv_id,
				edit: edit,
				paidStatus: item.inv_paid_status
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	// to edit invoice detials
	openDialog1(edit): void {
		const inv_id = this.fetchInvId();
		if (inv_id && inv_id.length === 1) {
			const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
				width: '80%',
				height: '80vh',
				data: {
					invoiceNo: inv_id[0],
					edit: edit,
					paidStatus: 'unpaid'
				}
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result.status === '1') {
					this.getFeeLedger(this.loginId);
				}
			});
		}
	}

	openReceiptDialog(rpt_id, edit): void {
		const dialogRef = this.dialog.open(ReceiptDetailsModalComponent, {
			width: '80%',
			data: {
				rpt_id: rpt_id,
				edit: edit
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => {
				/* if (row.selectionDisable === false) {
					this.selection.select(row);
				} */
				this.selection.select(row);
			});
	}

	checkboxLabel(row?: FeeLedgerElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}

	manipulateAction(row) {
		this.selection.toggle(row);
		console.log(this.selection.selected);
		const tempactionFlag: any = {
			deleteinvoice: true,
			deletereceipt: true,
			edit: true,
			recalculate: true,
			consolidate: true,
			attach: true,
			detach: true,
			unconsolidate: true,
			receiptmodification: true
		};
		if (this.selection.selected.length > 0) {
			this.selection.selected.forEach(item => {
				tempactionFlag.deleteinvoice = tempactionFlag.deleteinvoice && item.eachActionFlag.deleteinvoice && this.selection.selected.length > 0;
				tempactionFlag.deletereceipt = tempactionFlag.deletereceipt && item.eachActionFlag.deletereceipt && this.selection.selected.length > 0;
				tempactionFlag.edit = tempactionFlag.edit && item.eachActionFlag.edit && this.selection.selected.length === 1;
				tempactionFlag.recalculate = tempactionFlag.recalculate && item.eachActionFlag.recalculate && this.selection.selected.length > 0;
				tempactionFlag.consolidate = tempactionFlag.consolidate && item.eachActionFlag.consolidate && this.selection.selected.length > 1;
				tempactionFlag.attach = tempactionFlag.attach && item.eachActionFlag.attach && this.selection.selected.length === 1;
				tempactionFlag.detach = tempactionFlag.detach && item.eachActionFlag.detach && this.selection.selected.length === 1;
				tempactionFlag.unconsolidate = tempactionFlag.unconsolidate && item.eachActionFlag.unconsolidate && this.selection.selected.length > 0;
				// tslint:disable-next-line:max-line-length
				tempactionFlag.receiptmodification = tempactionFlag.receiptmodification && item.eachActionFlag.receiptmodification && this.selection.selected.length === 1;
			});
			this.actionFlag = tempactionFlag;
		} else {
			this.resetActionFlag();
		}
	}

	resetActionFlag() {
		this.actionFlag = {
			deleteinvoice: false,
			deletereceipt: false,
			edit: false,
			recalculate: false,
			consolidate: false,
			attach: false,
			detach: false,
			unconsolidate: false,
			receiptmodification: false
		};
	}

	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openDeleteReciptDialog = (data) => this.deleteReceiptModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	openConsolidateDialog = (data) => this.consolidateModal.openModal(data);
	openUnConsolidateDialog = (data) => this.unconsolidateModal.openModal(data);
	openDetachReceiptDialog = (data) => this.detachReceiptModal.openModal(data);
	openAttachDialog = (data) => this.searchModal.openModal(data);

	deleteConfirm(value) {
		this.deleteWithReasonModal.openModal(value);
	}

	deleteReciptConfirm(value) {
		this.deleteReceiptWithReasonModal.openModal(value);
	}

	fetchInvId() {
		const inv_id_arr = [];
		this.selection.selected.forEach(element => {
			if (element.action.flgr_inv_id) {
				inv_id_arr.push(element.action.flgr_inv_id);
			}
		});
		return inv_id_arr;
	}
	fetchRecId() {
		const rec_id_arr = [];
		this.selection.selected.forEach(element => {
			if (element.action.ftr_id) {
				rec_id_arr.push(element.action.ftr_id);
			}
		});
		return rec_id_arr;
	}

	deleteInvoiceFinal(value) {
		console.log(value);
		this.feeService.deleteInvoice(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	deleteReceiptFinal(value) {
		const param: any = {};
		param.ftr_id = value.inv_id;
		param.login_id = this.loginId;
		param.process_type = this.commonStudentProfileComponent.processType;
		param.reason_remark = value.reason_remark;
		param.reason_id = value.reason_id;
		// console.log(param);
		// console.log(this.commonStudentProfileComponent.processType);
		this.feeService.deleteReceipt(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	recalculateConfirm(value) {
		const param: any = {};
		param.inv_id = this.fetchInvId();
		param.recalculation_flag = 1;
		this.feeService.recalculateInvoice(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	consolidateConfirm(value) {
		this.feeService.consolidateInvoice({ inv_id: this.fetchInvId() }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	attachReceipt(value) {
		console.log('receipt value', value);
		this.feeService.attachReceipt(value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getFeeLedger(this.loginId);
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	unconsolidateConfirm(value) {
		this.feeService.unconsolidateInvoice({ inv_consolidate_id: this.fetchInvId() }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	detachReceiptConfirm(value) {
		console.log('value--', value);
		this.feeService.detachReceipt({ inv_id: value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	openReciptModificationDialog() {

	}
	openCreateInvoiceModal() {
		console.log(this.commonStudentProfileComponent.studentdetails);
		const stuDetails: any = {};
		stuDetails.stu_admission_no = this.commonStudentProfileComponent.studentdetails.em_admission_no;
		stuDetails.stu_full_name = this.commonStudentProfileComponent.studentdetails.au_full_name;
		stuDetails.stu_class_name = this.commonStudentProfileComponent.class_sec;
		stuDetails.au_login_id = this.commonStudentProfileComponent.studentdetails.au_login_id;
		stuDetails.fromPage = 'feeledger';
		const dialogRef = this.dialog.open(CreateInvoiceModalComponent, {
			width: '50%',
			data: {
				invoiceDetails: stuDetails
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(dresult => {
			if (dresult && dresult.status) {
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.loginId;
			}
		});
	}

	checkStatus() {
		if (this.commonStudentProfileComponent.studentdetails.editable_status === '1') {
			return true;
		} else {
			return false;
		}
	}

}
