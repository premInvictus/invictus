import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeLedgerElement } from './fee-ledger.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SisService, ProcesstypeFeeService, FeeService, CommonAPIService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
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
	displayedColumns: string[] = ['select', 'feeperiod', 'invoiceno', 'particular', 'date', 'duedate',
		'amount', 'concession', 'adjustment', 'fine', 'netpayableamount', 'reciept', 'balance', 'receiptdate', 'receiptno', 'mop', 'remarks'];
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
	schoolInfo: any;
	session: any;
	sessionName: any;
	sessionArray: any[] = [];
	currentUser: any;
	session_id: any;
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

	spans = [];
	showMore = false;
	currentShowMoreId = '';
	constructor(private sisService: SisService,
		private feeService: FeeService,
		public processtypeService: ProcesstypeFeeService,
		public dialog: MatDialog,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService,
		private commonAPIService: CommonAPIService
	) {
		this.session_id = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.getSchool();
		this.getSession();
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
	// get session year of the selected session
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
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
	}

	getFeeLedger(login_id) {
		this.selection.clear();
		this.resetActionFlag();
		let element: any = {};
		this.FEE_LEDGER_ELEMENT = [];
		this.spans = [];
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
				var dupInvoiceArr = []
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
						mop: item.mop,
						chqno: item.ftr_cheque_no ? item.ftr_cheque_no : '-',
						chequedate: item.ftr_cheque_date ? item.ftr_cheque_date : '-',
						colorCode: item.color_code ? item.color_code : '',
						// bank: item.tb_name ? item.tb_name : '-',
						netpayableamount: item.flgr_particulars === 'Ad-Hoc Payment' ? '0' : ( item.net_payable_amount ? item.net_payable_amount : '0'),
						eachActionFlag: tempactionFlag,
						action: item,
						flgr_payment_mode: item.flgr_payment_mode ? item.flgr_payment_mode : ''
					};
					
					
					// console.log('dupInvoiceArr--',dupInvoiceArr);
					// console.log('element.invoiceno--',element.invoiceno);
					// console.log('dupInvoiceArr.indexOf(element.invoiceno)-',dupInvoiceArr.indexOf(element.invoiceno));
					
					
					if(element.flgr_payment_mode === 'partial') {
						element['balance'] = this.getPartialInvoiceLastBalance(dupInvoiceArr, element.invoiceno);
						console.log("element['flgr_balance']",element['flgr_balance']);
					}

					if((dupInvoiceArr.indexOf(element.invoiceno) < 0) || item.flgr_inv_id === "0" ){
						dupInvoiceArr.push(element.invoiceno);												
						this.footerRecord.feeduetotal += Number(element.amount);
						this.footerRecord.concessiontotal += Number(element.concession);
						this.footerRecord.adjustmenttotal += Number(element.adjustment);					
						this.footerRecord.netpayabletotal += Number(element.netpayableamount);
						this.footerRecord.finetotal += Number(element.fine);
						this.footerRecord.balancetotal += Number(element.balance);
					} 

					
					
					

					this.footerRecord.receipttotal += Number(element.reciept);

					this.FEE_LEDGER_ELEMENT.push(element);
					pos++;
					
					
					//console.log(this.FEE_LEDGER_ELEMENT);
				}
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				//this.feeRenderId = '';
				console.log('this.FEE_LEDGER_ELEMENT',this.FEE_LEDGER_ELEMENT);
				
				this.cacheSpan('select', d => d.select);
				this.cacheSpan('feeperiod', d => d.feeperiod[0]);
				this.cacheSpan('invoiceno', d => d.invoiceno);
				this.cacheSpan('particular', d => d.particular);
				this.cacheSpan('date', d => d.date);
				this.cacheSpan('duedate', d => d.duedate);
				this.cacheSpan('amount', d => d.amount);
				this.cacheSpan('concession', d => d.concession);
				this.cacheSpan('adjustment', d => d.adjustment);
				this.cacheSpan('fine', d => d.fine);
				this.cacheSpan('netpayableamount', d => d.netpayableamount);
				this.cacheSpan('balance', d => d.balance);
				
				
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getPartialInvoiceLastBalance(dupInvoiceArr, invoice_no) {
		// var tempArr = [];
		// var inv_amount ;
		// var flgr_balance = 0;
		// for (let i=0; i<this.recordArray.length;i++) {			
		// 	if(this.recordArray[i]['flgr_invoice_receipt_no'] === invoice_no) {
		// 		inv_amount = this.recordArray[i]['flgr_amount'];
		// 		flgr_balance =  Number(flgr_balance) +  Number(this.recordArray[i]['flgr_receipt']);
		// 		console.log('flgr_balance--',flgr_balance);
		// 		tempArr.push(this.recordArray[i]['flgr_balance']);
		// 	}
		// }
		// var finAmt = Number(inv_amount)  - Number(flgr_balance);
		// console.log(inv_amount, 'tempArr--',tempArr.reverse(),finAmt);
		// return finAmt;
		var tempArr = [];
		for (let i=0; i<this.recordArray.length;i++) {
			if(this.recordArray[i]['flgr_payment_mode'] === 'partial' && this.recordArray[i]['flgr_invoice_receipt_no'] === invoice_no) {
				tempArr.push(this.recordArray[i]['flgr_balance']);
			}
		}
		// console.log('tempArr--',tempArr.reverse());
		return tempArr.reverse()[0];
	}

	getRowSpan(col, index) {
		//console.log('col '+col, 'index'+index, this.spans);
		return this.spans[index] && this.spans[index][col];
	}
	cacheSpan(key, accessor) {
		//console.log(key, accessor);
		for (let i = 0; i < this.FEE_LEDGER_ELEMENT.length;) {
			let currentValue = accessor(this.FEE_LEDGER_ELEMENT[i]);
			let count = 1;
			//console.log('currentValue',currentValue);
			// Iterate through the remaining rows to see how many match
			// the current value as retrieved through the accessor.
			for (let j = i + 1; j < this.FEE_LEDGER_ELEMENT.length; j++) {
				if (currentValue != accessor(this.FEE_LEDGER_ELEMENT[j])) {
					break;
				}
				count++;
			}

			if (!this.spans[i]) {
				this.spans[i] = {};
			}

			// Store the number of similar values that were found (the span)
			// and skip i to the next unique row.
			this.spans[i][key] = count;
			i += count;
		}
	}


	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'feeperiod',
			width: this.checkWidth('feeperiod', 'Fee Period')
		});
		columns.push({
			key: 'invoiceno',
			width: this.checkWidth('invoiceno', 'Inv. No.')
		});
		columns.push({
			key: 'particular',
			width: this.checkWidth('particular', 'Particulars')
		});
		columns.push({
			key: 'date',
			width: this.checkWidth('date', 'Inv. date')
		});
		columns.push({
			key: 'duedate',
			width: this.checkWidth('duedate', 'Due Date')
		});
		columns.push({
			key: 'amount',
			width: this.checkWidth('amount', 'Amt. Due')
		});
		columns.push({
			key: 'concession',
			width: this.checkWidth('concession', 'Con.')
		});
		columns.push({
			key: 'adjustment',
			width: this.checkWidth('adjustment', 'Adj.')
		});
		columns.push({
			key: 'fine',
			width: this.checkWidth('fine', 'Fine')
		});
		columns.push({
			key: 'netpayableamount',
			width: this.checkWidth('netpayableamount', 'Net Payable')
		});
		columns.push({
			key: 'reciept',
			width: this.checkWidth('reciept', 'Reciept')
		});
		columns.push({
			key: 'balance',
			width: this.checkWidth('balance', 'Balance')
		});
		columns.push({
			key: 'receiptdate',
			width: this.checkWidth('receiptdate', 'Rpt. Date')
		});
		columns.push({
			key: 'receiptno',
			width: this.checkWidth('receiptno', 'Rpt. No.')
		});
		columns.push({
			key: 'mop',
			width: this.checkWidth('mop', 'Mop')
		});
		columns.push({
			key: 'remarks',
			width: this.checkWidth('remarks', 'Remarks')
		});
		reportType = new TitleCasePipe().transform('Fee ledger report: ' + this.sessionName);
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A3:' + this.alphabetJSON[7] + '3');
		worksheet.getCell('A3').value = this.commonStudentProfileComponent.studentdetails.au_full_name + '(' +
			this.commonStudentProfileComponent.studentdetails.em_admission_no + ')';
		worksheet.getCell(`A3`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A4:' + this.alphabetJSON[7] + '4');
		worksheet.getCell('A4').value = 'Class : ' + this.commonStudentProfileComponent.studentdetails.class_name + ' ' +
			this.commonStudentProfileComponent.studentdetails.sec_name;
		worksheet.getCell(`A4`).alignment = { horizontal: 'left' };
		worksheet.getCell('A6').value = 'Fee Period';
		worksheet.getCell('B6').value = 'Inv.No.';
		worksheet.getCell('C6').value = 'Particulars';
		worksheet.getCell('D6').value = 'Inv. Date';
		worksheet.getCell('E6').value = 'Due Date';
		worksheet.getCell('F6').value = 'Amt. Due';
		worksheet.getCell('G6').value = 'Con.';
		worksheet.getCell('H6').value = 'Adj.';
		worksheet.getCell('I6').value = 'Fine';
		worksheet.getCell('J6').value = 'Net Payable';
		worksheet.getCell('K6').value = 'Amt.Rec.';
		worksheet.getCell('L6').value = 'Balance';
		worksheet.getCell('M6').value = 'Rpt.Date';
		worksheet.getCell('N6').value = 'Rpt. No';
		worksheet.getCell('O6').value = 'Mop';
		worksheet.getCell('P6').value = 'Remarks';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.FEE_LEDGER_ELEMENT) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.feeperiod;
			worksheet.getCell('B' + this.length).value = dety.invoiceno;
			worksheet.getCell('C' + this.length).value = dety.particular;
			worksheet.getCell('D' + this.length).value = dety.date;
			worksheet.getCell('E' + this.length).value = dety.duedate;
			worksheet.getCell('F' + this.length).value = dety.amount;
			worksheet.getCell('G' + this.length).value = dety.concession;
			worksheet.getCell('H' + this.length).value = dety.adjustment;
			worksheet.getCell('I' + this.length).value = dety.fine;
			worksheet.getCell('J' + this.length).value = dety.netpayableamount;
			worksheet.getCell('K' + this.length).value = dety.reciept;
			worksheet.getCell('L' + this.length).value = dety.balance;
			worksheet.getCell('M' + this.length).value = new DatePipe('en-in').transform(dety.receiptdate, 'd-MMM-y');
			worksheet.getCell('N' + this.length).value = dety.receiptno;
			worksheet.getCell('O' + this.length).value = dety.mop;
			worksheet.getCell('P' + this.length).value = dety.remarks;
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
		obj3['feeperiod'] = '';
		obj3['invoiceno'] = '';
		obj3['particular'] = '';
		obj3['date'] = '';
		obj3['duedate'] = '';
		obj3['amount'] = this.footerRecord.feeduetotal ? this.footerRecord.feeduetotal : '-';
		obj3['concession'] = this.footerRecord.concessiontotal ? this.footerRecord.concessiontotal : '-';
		obj3['adjustment'] = this.footerRecord.adjustmenttotal ? this.footerRecord.adjustmenttotal : '-';
		obj3['fine'] = this.footerRecord.finetotal ? this.footerRecord.finetotal : '-';
		obj3['netpayableamount'] = this.footerRecord.netpayabletotal ? this.footerRecord.netpayabletotal : '-';
		obj3['reciept'] = this.footerRecord.receipttotal ? this.footerRecord.receipttotal : '-';
		obj3['balance'] = this.footerRecord.balancetotal ? this.footerRecord.balancetotal : '-';
		obj3['receiptdate'] = '';
		obj3['receiptno'] = '';
		obj3['mop'] = '';
		obj3['remarks'] = '';
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
	// check the max  width of the cell
	checkWidth(id, header) {
		const res = this.FEE_LEDGER_ELEMENT.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
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
				tempactionFlag.detach = (tempactionFlag.detach && item.eachActionFlag.detach && this.selection.selected.length === 1) || item.flgr_payment_mode === 'partial';
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
		const invoiceJson: any = {};
		invoiceJson.id = value;
		invoiceJson.receipt_id = 13;
		this.deleteWithReasonModal.openModalFee(invoiceJson);
	}

	deleteReciptConfirm(value) {
		const receiptJson: any = {};
		receiptJson.id = value;
		receiptJson.receipt_id = 14;
		this.deleteReceiptWithReasonModal.openModalFee(receiptJson);
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
				this.getFeeLedger(this.loginId);
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	detachReceiptConfirm(value) {
		this.feeService.detachReceipt({ inv_id: value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.feeRenderId = '';
				this.getFeeLedger(this.loginId);
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	openReciptModificationDialog() {

	}
	openCreateInvoiceModal() {
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
				this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
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

	getShowMore(i) {
		console.log(i,this.FEE_LEDGER_ELEMENT);
		console.log('this.dataSource[i]',this.FEE_LEDGER_ELEMENT[i]);
		this.FEE_LEDGER_ELEMENT[i]['showMore'] = true;
	}

	getShowLess(i) {
		this.FEE_LEDGER_ELEMENT[i]['showMore'] = false;
	}

}
