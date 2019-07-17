import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeLedgerElement } from './fee-ledger.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SisService, ProcesstypeFeeService, FeeService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { ReceiptDetailsModalComponent } from '../../sharedmodule/receipt-details-modal/receipt-details-modal.component';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';

@Component({
	selector: 'app-fee-ledger',
	templateUrl: './fee-ledger.component.html',
	styleUrls: ['./fee-ledger.component.scss']
})
export class FeeLedgerComponent implements OnInit {

	displayedColumns: string[] = ['select', 'srno', 'date', 'invoiceno', 'particular', 'duedate',
	 'amount', 'concession', 'fine', 'reciept', 'balance', 'receiptdate', 'receiptno', 'mop', 'remarks'];
	FEE_LEDGER_ELEMENT: FeeLedgerElement[] = [];
	dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
	selection = new SelectionModel<FeeLedgerElement>(true, []);
	recordArray: any[] = [];
	lastRecordId: any;
	loginId: any;
	footerRecord: any = {
		feeduetotal: 0,
		concessiontotal: 0,
		receipttotal: 0
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
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
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
					receipttotal: 0
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
						tempactionFlag.deletereceipt = true;
						tempactionFlag.detach = true;
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
						fine: item.inv_fine_amount ? item.inv_fine_amount : '0',
						reciept: item.rpt_net_amount ? item.rpt_net_amount : '0',
						balance: item.flgr_balance ? item.flgr_balance : '0',
						receiptdate: item.rpt_receipt_date,
						receiptno: item.rpt_receipt_no,
						mop: item.pay_name + (item.tb_name ? '(' + item.tb_name + ')' : ''),
						eachActionFlag: tempactionFlag,
						action: item
					};
					this.FEE_LEDGER_ELEMENT.push(element);
					pos++;
					this.footerRecord.feeduetotal += Number(element.amount);
					this.footerRecord.concessiontotal += Number(element.concession);
					this.footerRecord.receipttotal += Number(element.reciept);
				}
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			}
		});
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
	openDialog(invoiceNo, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: invoiceNo,
				edit: edit,
				paidStatus: 'paid'
			},
			hasBackdrop: true
		});

		dialogRef.afterClosed().subscribe(result => {
		});
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
				tempactionFlag.receiptmodification = tempactionFlag.receiptmodification && item.eachActionFlag.receiptmodification && this.selection.selected.length === 1;
			});
			this.actionFlag = tempactionFlag;
		} else {
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
	}


}
