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
import { CapitalizePipe, IndianCurrency } from '../../_pipes';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { element } from 'protractor';
import { p } from '@angular/core/src/render3';

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
	notFormatedCellArray: any[] = [];
	process_type = '';
	header: any;
	checkallstatus = false;
	datasource: any = [];
	settings: any[] = [];
	resultdataArray = [];
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
	bankArray: any[] = [];
	currentUser: any;
	showMissingInvoice = false;
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
		// this.checkEmit(1);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getSchool();
		this.getSession();
		this.getbanks();
		if (this.studentRouteMoveStoreService.getProcesRouteType()) {
			this.process_type = this.studentRouteMoveStoreService.getProcesRouteType();
		} else {
			this.process_type = '4';
		}
		this.processtypeService.setProcesstype(this.process_type);
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
				this.getDataofMissingInvoice();
			} else {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
						this.recordArray = [];
						this.FEE_LEDGER_ELEMENT = [];
						this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
						this.getFeeLedger(this.loginId);
						this.getDataofMissingInvoice();
					}
				});
			}

		});
	}

	getbanks() {
		this.feeService.getBanks({}).subscribe((res: any) => {
			console.log(res);
			this.bankArray = res.data;

		})
	}
	getGlobalSetting() {
		let param: any = {};
		param.gs_alias = ['gradecard_scholastic_abbreviation','gradecard_show_scholastic_gradescale','gradecard_attendance','gradecard_total_mettings','gradecard_mettings_present','gradecard_header', 'gradecard_footer', 'gradecard_principal_signature', 'gradecard_use_principal_signature', 'gradecard_use_hod_signature', 'gradecard_hod_signature', 'gradecard_use_teacher_signature', 'school_attendance_theme',
		  'gradecard_health_status', 'gradecard_date', 'school_achievement'];
		this.feeService.getGlobalSettingReplace(param).subscribe((result: any) => {
		  if (result && result.status === 'ok') {
			this.settings = result.data;
			this.settings.forEach(element => {
			  
			  if (element.gs_alias === 'gradecard_header') {
				this.header = element.gs_value;
				this.header = this.header.replace('@','data:image/png;base64,');
				// var regex = /<img.*?src="(.*?)"/;
				// var src = regex.exec(this.header)[1];
				// console.log(src);
			  } 
			});
		  }
		})
	  }

	checkEmit(process_type) {
		this.process_type = process_type;
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
	async downloadPdf() {

		let headName = ['Rpt. No', 'Rpt. Date', 'Period', 'Mode', 'Bank Name', 'Ch. No/Txn. No', 'Drawn on Bank'];


		this.feeService.getHeadWiseStudentDetail({ login_id: this.loginId }).subscribe(async (result: any) => {
			result.data[1].map((element) => {
				// console.log("i am element", element);
				if (element.fh_class_id.includes(result.data[0][0].au_class_id)) {
					headName.push(element.fh_name)
				}

			});
			headName.push('Fine');
			headName.push('Total');
			let pdfrowdata = [];

			let alast = []
			for (let i = 0; i < headName.length; i++) {
				if (i < 7) {
					alast.push('');
				}
				else {
					alast.push(0);
				}

			}
			let arr = [];
			result.data[0].map((element) => {
				let bank_name_1 = '';
				let bank_name = this.bankArray.filter((e) => {

					if (e.bnk_gid == element.ftr_deposit_bnk_id)
						return true
				})
				if (bank_name && bank_name.length > 0) {
					bank_name_1 = bank_name[0].bank_name;
				}
				let a = [];
				let amt = [];
				let at_val = false;
				let main = false;
				arr.filter((e) => {
					if (e.rpt_receipt_no == element.rpt_receipt_no) {
						main = true;
					}
				})
				if (!main) {
					a.push(element.rpt_receipt_no);
					a.push(new DatePipe('en-in').transform(element.rpt_receipt_date, 'd-MMM-y'));
					a.push(element.fp_months[0]);
					a.push(element.pay_name);
					a.push(element.bank_name_1);
					a.push(element.ftr_cheque_no);
					a.push(element.ftr_bnk_name);
					for (let i = 0; i < headName.length - 9; i++) {
						let da = element.invoice_bifurcation.filter((e) => {
							if (parseInt(result.data[1][i].fh_id) == parseInt(e.invg_fh_id))
								return true;
						});


						if (da && da.length > 0) {
							amt = arr.filter((e) => {
								if (e.inv_id == element.inv_id) {
									return true
								}
							});
							amt.filter((e) => {
								e.invoice_bifurcation.filter((ch) => {
									if (ch.invg_fh_id == da[0].invg_fh_id) {
										at_val = true
									}
								})
							})
							a.push(!at_val ? new IndianCurrency().transform(da[0].invg_fh_amount ? parseInt(da[0].invg_fh_amount) : 0) : '-')
							if (element.rpt_receipt_no)
								alast[i + 7] += !at_val ? (da[0].invg_fh_amount ? parseInt(da[0].invg_fh_amount) : 0) : 0;
						} else {
							a.push('-');
							alast[i + 7] += 0;
						}
					}
					a.push(new IndianCurrency().transform(element.late_fine_amt ? element.late_fine_amt : 0));
					a.push(new IndianCurrency().transform(element.rpt_net_amount ? (element.rpt_net_amount) : 0));


					if (element.rpt_receipt_no) {
						alast[alast.length - 2] += parseInt(element.late_fine_amt ? element.late_fine_amt : 0);
						alast[alast.length - 1] += parseInt(element.rpt_net_amount ? (element.rpt_net_amount) : 0);
						pdfrowdata.push(a);
					}


					arr.push(element);
				}

			})
			// console.log(alast);
			alast[5] = 'Total';
			for (let i = 7; i < headName.length; i++) {
				alast[i] = new IndianCurrency().transform(alast[i]);
			}
			pdfrowdata.push(alast);
			let objct: any = {};
			for (let i = 0; i < headName.length; i++) {
				objct.i = { 'cellWidth': 300 / headName.length }
			}

			const doc = new jsPDF('l', 'mm', 'a4');
			doc.levelHeading = [];
			doc.levelTotalFooter = [];
			doc.levelSubtotalFooter = [];
			
			
			async function getBase64ImageFromUrl(imageUrl) {
				var res = await fetch(imageUrl);
				var blob = await res.blob();
			  
				return new Promise((resolve, reject) => {
				  var reader  = new FileReader();
				  reader.addEventListener("load", function () {
					  resolve(reader.result);
				  }, false);
			  
				  reader.onerror = () => {
					return reject(this);
				  };
				  reader.readAsDataURL(blob);
				})
			  }

			var imageurl = await getBase64ImageFromUrl(this.schoolInfo.school_logo);
			
			
			
			doc.autoTable({
				// startY: doc.previousAutoTable.finalY + 0.2,
				
				head: [[new CapitalizePipe().transform(this.schoolInfo.school_name)]],
				didDrawPage: function (data) {
					// doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 12,
				},
				useCss: true,
				theme: 'striped'
			});
			
			doc.autoTable({
				head: [[this.schoolInfo.school_city + ',' + this.schoolInfo.school_state]],
				startY: doc.previousAutoTable.finalY + 0.2,
				didDrawPage: function (data) {
					// doc.setFont('Roboto');
				},
				headerStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 11,
				},
				useCss: true,
				theme: 'striped'
			});
			
			doc.autoTable({
				head: [[new TitleCasePipe().transform('Receipt Ledger ' + this.sessionName)]],
				startY: doc.previousAutoTable.finalY + 0.2,
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'center',
					fontSize: 11,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.addImage(imageurl, 'jpg', 20, 10, 40, 30);
			doc.autoTable({
				wrap: true,
				startY: doc.previousAutoTable.finalY + 0.2,
				// tslint:disable-next-line:max-line-length
				head: [[`Admission Number:  ${result.data[0][0].au_admission_no}`,'      ', `Active Parent     : ${this.commonStudentProfileComponent.studentdetails.parentinfo[0].epd_parent_name}`]],
				didDrawPage: function (data) {

				},
				headStyles: {
					// fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 10,
				},
				useCss: true,
				theme: 'striped',
				columnStyles: {
					0: { 'cellWidth': 'wrap' },
					1: {  margin: { left: -10} }
				}
			});
			doc.autoTable({
				startY: doc.previousAutoTable.finalY + 0.1,
				// tslint:disable-next-line:max-line-length
				head: [[`Class                        : ${result.data[0][0].class_name} - ${result.data[0][0].sec_name}`, `Active Parent no: ${this.commonStudentProfileComponent.studentdetails.parentinfo[0].epd_contact_no}`]],
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 10,

				},
				useCss: true,
				theme: 'striped',
				columnStyles: {
					0: { cellWidth: 'wrap' },
					1: { margin: { left: -10}}
				}
			});
			doc.autoTable({
				startY: doc.previousAutoTable.finalY + 0.1,
				// tslint:disable-next-line:max-line-length
				head: [[`Student Name         : ${result.data[0][0].au_full_name}`]],
				didDrawPage: function (data) {

				},
				headStyles: {
					// fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 10,
				},

				useCss: true,
				theme: 'striped',
				columnStyles: {
					0: { cellWidth: 200,  },
					1: { cellWidth: 100 }
				}
			});
			doc.autoTable({
				head: [headName],
				body: pdfrowdata,
				startY: doc.previousAutoTable.finalY + 0.5,
				tableLineColor: 'black',
				didDrawPage: function (data) {
					doc.setFontStyle('bold');
				},
				willDrawCell: function (data) {
					// tslint:disable-next-line:no-shadowed-variable
					const doc = data.doc;
					const rows = data.table.body;

					// level 0
					const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
					if (lfIndex !== -1) {
						doc.setFontStyle('bold');
						doc.setFontSize('8');
						doc.setTextColor('#ffffff');
						doc.setFillColor(0, 62, 120);
					}

					// level more than 0
					const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
					if (lsfIndex !== -1) {
						doc.setFontStyle('bold');
						doc.setFontSize('8');
						doc.setTextColor('#ffffff');
						doc.setFillColor(229, 136, 67);
					}

					// group heading
					const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
					if (lhIndex !== -1) {
						doc.setFontStyle('bold');
						doc.setFontSize('8');
						doc.setTextColor('#5e666d');
						doc.setFillColor('#c8d6e5');
					}

					// grand total
					if (data.row.index === rows.length - 1) {
						doc.setFontStyle('bold');
						doc.setFontSize('8');
						doc.setTextColor('#ffffff');
						doc.setFillColor(67, 160, 71);
					}
				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#c8d6e5',
					textColor: '#5e666d',
					fontSize: 8,
					halign: 'center',
					lineWidth: 0.1,
        			lineColor: [0, 0, 0]
				},
				alternateRowStyles: {
					fillColor: '#f1f4f7'
				},
				useCss: true,

				styles: {
					rowHeight: 7,
					fontSize: 7,
					cellWidth: 'auto',
					textColor: 'black',
					lineColor: '#89a8c8',
					valign: 'middle',
					halign: 'center',
					columnWidth: 'wrap'
				},
				columnStyles: objct,

				// etc
				theme: 'grid'
			});
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				head: [['Generated On: '
					+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 8,
					
				},
				useCss: true,
				theme: 'striped'
			});
			doc.autoTable({
				// tslint:disable-next-line:max-line-length
				startY: doc.previousAutoTable.finalY + 0.5,
				head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 8,
				},
				useCss: true,
				theme: 'striped'
			});
			doc.save('Receipt_Ledger_' + this.loginId + ".pdf");
		})
	}

	downloadExcel() {

		let reportType: any = '';
		const columns: any = [];
		const columValue: any = ['Rpt. No', 'Rpt. Date', 'Period', 'Mode', 'Bank Name', 'Ch. No/ Txn. No.', 'Drawn on Bank']
		columns.push({
			key: 'rpt_receipt_no',
			width: this.checkWidth('rpt_receipt_no', 'Rpt. No')
		});
		columns.push({
			key: 'rpt_receipt_date',
			width: this.checkWidth('rpt_receipt_date', 'Rpt. Date')
		});
		columns.push({
			key: 'fp_months',
			width: this.checkWidth('fp_months', 'Period')
		});
		columns.push({
			key: 'pay_name',
			width: this.checkWidth('pay_name', 'Mode')
		});
		columns.push({
			key: 'bank_name_1',
			width: this.checkWidth('bank_name_1', 'Bank Name')
		});
		columns.push({
			key: 'ftr_cheque_no',
			width: this.checkWidth('ftr_cheque_no', 'Ch. No/ Txn. No.')
		});
		columns.push({
			key: 'ftr_bnk_name',
			width: this.checkWidth('ftr_bnk_name', 'Drawn on Bank')
		});
		let columndefinition = [
			{
				id: 'rpt_receipt_no',
				name: 'Rpt. No'
			},
			{
				id: 'rpt_receipt_date',
				name: 'Rpt. Date'
			},
			{
				id: 'fp_months',
				name: 'Period'
			},
			{
				id: 'pay_name',
				name: 'Mode'
			},
			{
				id: 'bank_name_1',
				name: 'Bank Name'
			},
			{
				id: 'ftr_cheque_no',
				name: 'Ch. No/ Txn. No.'
			},
			{
				id: 'ftr_bnk_name',
				name: 'Drawn on Bank'
			}
		];


		this.feeService.getHeadWiseStudentDetail({ login_id: this.loginId }).subscribe((result: any) => {
			result.data[1].map((element) => {
				// console.log("i am element", element);
				if (element.fh_class_id.includes(result.data[0][0].au_class_id)) {
					// columns.push(element.fh_name)
					columns.push({
						key: element.fh_id,
						width: this.checkWidth(element.fh_id, element.fh_name)
					});
					columndefinition.push({
						id: element.fh_id,
						name: element.fh_name
					});
					columValue.push(element.fh_name)
				}

			});

			columns.push({
				key: 'late_fine_amt',
				width: this.checkWidth('late_fine_amt', 'Fine')
			});
			columns.push({
				key: 'rpt_net_amount',
				width: this.checkWidth('rpt_net_amount', 'Total')
			});
			columndefinition.push(
				{
					id: 'late_fine_amt',
					name: 'Fine'
				}
			);
			columndefinition.push({
				id: 'rpt_net_amount',
				name: 'Total'
			});
			columValue.push('Fine');
			columValue.push('Total');

			reportType = new TitleCasePipe().transform('Receipt ledger : ' + this.sessionName + ' ' );
			const fileName = new TitleCasePipe().transform('Receipt ledger_: ' + this.sessionName + '_' + this.commonStudentProfileComponent.studentdetails.au_full_name + '_' + this.commonStudentProfileComponent.studentdetails.em_admission_no) + '.xlsx';
			const workbook = new Excel.Workbook();
			console.log("i am column ", columns.length, Math.floor(columns.length / 2), this.alphabetJSON[Math.floor(columns.length / 2) + 1]);

			const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
				{ pageSetup: { fitToWidth: 7 } });
			worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1');
			worksheet.getCell('A1').value =
				new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;

			worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
			worksheet.getCell('A2').value = reportType;
			worksheet.mergeCells('A3:' + this.alphabetJSON[Math.floor(columns.length / 2)] + '3');
			worksheet.getCell('A3').value = `Admission Number:  ${result.data[0][0].au_admission_no}`;
			worksheet.mergeCells(`${this.alphabetJSON[Math.floor(columns.length / 2) + 1]}3:` + this.alphabetJSON[columns.length] + '3');
			worksheet.getCell(`${this.alphabetJSON[Math.floor(columns.length / 2) + 1]}3`).value = `Active Parent: ${this.commonStudentProfileComponent.studentdetails.parentinfo[0].epd_parent_name}`;
			worksheet.mergeCells('A4:' + this.alphabetJSON[Math.floor(columns.length / 2)] + '4');
			worksheet.getCell('A4').value = `Class: ${result.data[0][0].class_name} - ${result.data[0][0].sec_name}`;
			worksheet.mergeCells(`${this.alphabetJSON[Math.floor(columns.length / 2) + 1]}4:` + this.alphabetJSON[columns.length] + '4');
			worksheet.getCell(`${this.alphabetJSON[Math.floor(columns.length / 2) + 1]}4`).value = `Active Parent no: ${this.commonStudentProfileComponent.studentdetails.parentinfo[0].epd_contact_no}`;
			worksheet.mergeCells('A5:' + this.alphabetJSON[Math.floor(columns.length)] + '5');
			worksheet.getCell('A5').value = `Student Name: ${result.data[0][0].au_full_name}`;

			worksheet.getRow(6).values = columValue;
			worksheet.columns = columns;
			// for(let i = 0; i < columValue.length; i++) {
			// 	if(i < 7) {
			// 		alast.push('');
			// 	}
			// 	else{
			// 		alast.push(0);
			// 	}

			// }
			
			console.log("i am col def", columndefinition);

			let arr = [];
			let obj2: any = {};
			for(let i = 0; i < columndefinition.length; i++) {
				obj2[`${columndefinition[i].id}`] = ''
			}

			obj2.ftr_bnk_name = 'Grand Total';
			result.data[0].map((element) => {
				let obj: any = {}
				let bank_name_1 = '';
				let bank_name = this.bankArray.filter((e) => {

					if (e.bnk_gid == element.ftr_deposit_bnk_id)
						return true
				})
				if (bank_name && bank_name.length > 0) {
					bank_name_1 = bank_name[0].bank_name;
				}
				let a = [];
				let amt = [];
				let at_val = false;
				let main = false;
				arr.filter((e) => {
					if (e.rpt_receipt_no == element.rpt_receipt_no) {
						main = true;
					}
				})
				if (!main) {
					obj.rpt_receipt_no = element.rpt_receipt_no;
					obj.rpt_receipt_date = (new DatePipe('en-in').transform(element.rpt_receipt_date, 'd-MMM-y'));
					obj.fp_months = (element.fp_months[0]) ? element.fp_months[0]: '-';
					obj.pay_name = (element.pay_name);
					obj.bank_name_1 = (element.bank_name_1) ? element.bank_name_1: '-';
					obj.ftr_cheque_no = (element.ftr_cheque_no) ? element.ftr_cheque_no : '-';
					obj.late_fine_amt = (element.late_fine_amt ? element.late_fine_amt: 0);	
					obj.rpt_net_amount = (element.rpt_net_amount ? (element.rpt_net_amount) : 0);

					obj.ftr_bnk_name = (element.ftr_bnk_name);
					for (let i = 0; i < columValue.length - 9; i++) {
						let da = element.invoice_bifurcation.filter((e) => {
							if (parseInt(result.data[1][i].fh_id) == parseInt(e.invg_fh_id))
								return true;
						});


						if (da && da.length > 0) {
							amt = arr.filter((e) => {
								if (e.inv_id == element.inv_id) {
									return true
								}
							});
							amt.filter((e) => {
								e.invoice_bifurcation.filter((ch) => {
									if (ch.invg_fh_id == da[0].invg_fh_id) {
										at_val = true
									}
								})
							})
							obj[`${da[0].invg_fh_id}`] = (!at_val ? (da[0].invg_fh_amount ? parseInt(da[0].invg_fh_amount) : 0) : '-');

							if (element.rpt_receipt_no)
							{
								if(!obj2[`${da[0].invg_fh_id}`] || obj2[`${da[0].invg_fh_id}`] == '') {
									obj2[`${da[0].invg_fh_id}`] = 0
								}
								obj2[`${da[0].invg_fh_id}`] += !at_val ? (da[0].invg_fh_amount ? parseInt(da[0].invg_fh_amount) : 0) : 0;
							}
								
						}


					}
					


					if (element.rpt_receipt_no) {
						if(!obj2.late_fine_amt || obj2.late_fine_amt == '') {
							obj2.late_fine_amt = 0
						}
						if(!obj2.rpt_net_amount || obj2.rpt_net_amount == '') {
							obj2.rpt_net_amount = 0
						}
						obj2.late_fine_amt += parseInt(element.late_fine_amt ? element.late_fine_amt : 0);
						obj2.rpt_net_amount += parseInt(element.rpt_net_amount ? (element.rpt_net_amount) : 0);
						console.log(obj, ' -----------------------------------------------', element.late_fine_amt, element.rpt_net_amount);

						worksheet.addRow(obj);
					}


					arr.push(element);
				}

			})


			worksheet.addRow(obj2);

			worksheet.getRow(worksheet._rows.length).eachCell(cell => {
				columndefinition.forEach(element => {
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.alignment = { wrapText: true, horizontal: 'center' };
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '439f47' },
						bgColor: { argb: '439f47' }
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
				});
			});
			// style all row of excel
			worksheet.eachRow((row, rowNum) => {
				if (rowNum === 1) {
					row.font = {
						name: 'Arial',
						size: 14,
						bold: true
					};
					row.eachCell((cell) => {
						cell.alignment = { horizontal: 'center', wrapText: true };
					})
				} else if (rowNum === 2) {
					row.font = {
						name: 'Arial',
						size: 12,
						bold: true
					};
					row.eachCell((cell) => {
						cell.alignment = { horizontal: 'center', wrapText: true };
					})
				} else if (rowNum === 4 || rowNum === 3 || rowNum === 5) {
					row.eachCell((cell) => {
						cell.font = {
							name: 'Arial',
							size: 12,
							bold: true
						};
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'bdbdbd' },
							bgColor: { argb: 'bdbdbd' },
						};
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						};
						cell.alignment = { horizontal: 'center', wrapText: true };
					});
				} else if (rowNum > 5 && rowNum < worksheet._rows.length) {
					// const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
					if (1 == 1) {
						row.eachCell((cell) => {
							cell.font = {
								name: 'Arial',
								size: 10,
							};
							cell.alignment = { wrapText: true, horizontal: 'center' };
						});
						if (rowNum % 2 === 0) {
							row.eachCell((cell) => {
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: 'ffffff' },
									bgColor: { argb: 'ffffff' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						} else {
							row.eachCell((cell) => {
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: 'ffffff' },
									bgColor: { argb: 'ffffff' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
							});
						}

					}
				}
				row.defaultRowHeight = 24;
			});
			worksheet.columns.forEach(column => {
				column.width = 15
			  })


			workbook.xlsx.writeBuffer().then(data => {
				const blob = new Blob([data], { type: 'application/octet-stream' });
				saveAs(blob, fileName);
			});
		});

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
						netpayableamount: item.flgr_particulars === 'Ad-Hoc Payment' ? '0' : (item.net_payable_amount ? item.net_payable_amount : '0'),
						eachActionFlag: tempactionFlag,
						action: item,
						flgr_payment_mode: item.flgr_payment_mode ? item.flgr_payment_mode : ''
					};

					console.log('element--', element);
					// console.log('dupInvoiceArr--',dupInvoiceArr);
					// console.log('element.invoiceno--',element.invoiceno);
					// console.log('dupInvoiceArr.indexOf(element.invoiceno)-',dupInvoiceArr.indexOf(element.invoiceno));


					if (element.flgr_payment_mode === 'partial') {
						element['balance'] = this.getPartialInvoiceLastBalance(dupInvoiceArr, element.invoiceno);
						console.log("element['flgr_balance']", element['balance']);
					}

					if ((dupInvoiceArr.indexOf(element.invoiceno) < 0) || item.flgr_inv_id === "0") {
						dupInvoiceArr.push(element.invoiceno);
						this.footerRecord.feeduetotal += Number(element.amount);
						this.footerRecord.concessiontotal += Number(element.concession);
						this.footerRecord.adjustmenttotal += Number(element.adjustment);
						this.footerRecord.netpayabletotal += Number(element.netpayableamount);
						this.footerRecord.finetotal += Number(element.fine);
						this.footerRecord.balancetotal += Number(element.balance);
					}




					if (item.ftr_status !== "2") {
						this.footerRecord.receipttotal += Number(element.reciept);
					}


					this.FEE_LEDGER_ELEMENT.push(element);
					pos++;


					//console.log(this.FEE_LEDGER_ELEMENT);
				}
				this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
				//this.feeRenderId = '';
				console.log('this.FEE_LEDGER_ELEMENT', this.FEE_LEDGER_ELEMENT);

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
		var tempArr = [];
		var pgStatus = 0;

		//this.recordArray.sort( function ( a, b ) { return b.flgr_id - a.flgr_id; } );
		console.log('recordArray--', this.recordArray);
		var partialLedgerArr = [];
		for (let i = 0; i < this.recordArray.length; i++) {
			if (this.recordArray[i]['flgr_payment_mode'] === 'partial' && this.recordArray[i]['flgr_invoice_receipt_no'] === invoice_no) {
				partialLedgerArr.push(this.recordArray[i]);

				tempArr.push(this.recordArray[i]['flgr_balance']);
				//console.log('this.recordArray[i]', this.recordArray[i]);
				if (this.recordArray[i]['ftr_pay_id'] === "6") {
					pgStatus = 1;
				}
			}

		}
		partialLedgerArr.sort(function (a, b) { return b.flgr_id - a.flgr_id; });
		console.log('tempArr--', tempArr.reverse(), pgStatus, partialLedgerArr);
		return pgStatus ? tempArr[0] : partialLedgerArr[0]['flgr_balance'];
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
		reportType = new TitleCasePipe().transform('Fee_ledger_report: ' + this.sessionName + '_' + this.commonStudentProfileComponent.studentdetails.au_full_name + '_' + this.commonStudentProfileComponent.studentdetails.em_admission_no);
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

	changeToggle() {
		this.showMissingInvoice = !this.showMissingInvoice;
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
			this.getDataofMissingInvoice();
		} else {
			this.getFeeLedger(this.loginId);
			this.getDataofMissingInvoice();
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
			this.getDataofMissingInvoice();
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
			this.getDataofMissingInvoice();
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
			this.getDataofMissingInvoice();
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
			this.getDataofMissingInvoice();
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
			this.getDataofMissingInvoice();
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
			this.getDataofMissingInvoice();
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
			this.getDataofMissingInvoice();
		} else {
			this.recordArray = [];
			this.FEE_LEDGER_ELEMENT = [];
			this.dataSource = new MatTableDataSource<FeeLedgerElement>(this.FEE_LEDGER_ELEMENT);
			this.getFeeLedger(this.loginId);
			this.getDataofMissingInvoice();
		}
	}
	// to veiw invoice details
	openDialog(item, edit): void {
		const dialogRef = this.dialog.open(InvoiceDetailsModalComponent, {
			width: '80%',
			data: {
				invoiceNo: item.flgr_inv_id ? item.flgr_inv_id : item.inv_id,
				edit: edit,
				paidStatus: item.inv_paid_status,
				fromModel: true
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
					this.getDataofMissingInvoice();
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
		console.log(this.selection.selected, row);
		let tempactionFlag: any
		if (row && row.flgr_payment_mode === "partial") {
			tempactionFlag = {
				deleteinvoice: false,
				deletereceipt: false,
				edit: false,
				recalculate: false,
				consolidate: false,
				attach: true,
				detach: true,
				unconsolidate: false,
				receiptmodification: false
			};
		} else {
			tempactionFlag = {
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
		}

		if (this.selection.selected.length > 0) {
			this.selection.selected.forEach(item => {
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.deleteinvoice = false;
				} else {
					tempactionFlag.deleteinvoice = tempactionFlag.deleteinvoice && item.eachActionFlag.deleteinvoice && this.selection.selected.length > 0;
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.deletereceipt = false;
				} else {
					tempactionFlag.deletereceipt = tempactionFlag.deletereceipt && item.eachActionFlag.deletereceipt && this.selection.selected.length > 0;
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.edit = false;
				} else {
					tempactionFlag.edit = tempactionFlag.edit && item.eachActionFlag.edit && this.selection.selected.length === 1;
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.recalculate = false;
				} else {
					tempactionFlag.recalculate = tempactionFlag.recalculate && item.eachActionFlag.recalculate && this.selection.selected.length > 0;
				}
				if (this.selection.selected.length > 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.attach = false;
				} else {
					tempactionFlag.attach = tempactionFlag.attach && item.eachActionFlag.attach && this.selection.selected.length === 1;
				}
				if (this.selection.selected.length > 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.detach = false;
				} else {
					tempactionFlag.detach = (tempactionFlag.detach && item.eachActionFlag.detach && this.selection.selected.length === 1) || item.flgr_payment_mode === 'partial';
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.consolidate = false;
				} else {
					tempactionFlag.consolidate = tempactionFlag.consolidate && item.eachActionFlag.consolidate && this.selection.selected.length > 0;
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.unconsolidate = false;
				} else {
					tempactionFlag.unconsolidate = tempactionFlag.unconsolidate && item.eachActionFlag.unconsolidate && this.selection.selected.length > 0;
				}
				if (this.selection.selected.length >= 1 && item.flgr_payment_mode === 'partial') {
					tempactionFlag.receiptmodification = false;
				} else {
					tempactionFlag.receiptmodification = tempactionFlag.receiptmodification && item.eachActionFlag.receiptmodification && this.selection.selected.length === 1;
				}





				// tslint:disable-next-line:max-line-length


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
		console.log(i, this.FEE_LEDGER_ELEMENT);
		console.log('this.dataSource[i]', this.FEE_LEDGER_ELEMENT[i]);
		this.FEE_LEDGER_ELEMENT[i]['showMore'] = true;
	}

	getShowLess(i) {
		this.FEE_LEDGER_ELEMENT[i]['showMore'] = false;
	}

	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

	getDataofMissingInvoice() {
		// console.log("i am this",this.process_type, this.loginId, this.commonStu, this.stuAcc, this.studentDetails);
		this.datasource = [];
		this.feeService.getMissingInvoiceDetails({ au_login_id: this.loginId, process_type: this.process_type }).subscribe(
			(res: any) => {
				// console.log("i am res", res);

				if (res.status == 'error') {
					this.datasource = [];
				}
				else if (res) {
					this.datasource = res
				}
				else {
					this.datasource = [];
					// this.commonAPIService.showSuccessErrorMessage('No Data Fetchecd', 'error');
				}
			}
		)
	}
	getInteger(a, b, c) {
		return new IndianCurrency().transform(parseInt(a) + parseInt(b) + parseInt(c));
	}
	getValue(b) {
		return JSON.parse(b)[0];
	}

	getItem(item) {
		// function containsObject(obj, list) {
		// 	var i;
		// 	for (i = 0; i < list.length; i++) {
		// 		if (list[i] === obj) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }
		if (this.resultdataArray.length == 0) {
			this.resultdataArray.push(item);
			this.checkallstatus = false;
		} else {
			console.log("i am here", this.resultdataArray.filter(e => e == item));

			if (this.resultdataArray.filter(e => e == item).length > 0) {
				this.resultdataArray = this.resultdataArray.filter(e => e != item);
				this.checkallstatus = false;
				//   this.checkResult(item);
			}
			else {
				this.resultdataArray.push(item);
				if (this.datasource.length == this.resultdataArray.length) {
					this.checkallstatus = true;
				}
				//   this.checkResult(item);
			}
		}
		console.log("i am result array", this.resultdataArray);

	}

	getallItem() {
		if (this.resultdataArray.length < this.datasource.length) {
			this.resultdataArray = this.datasource;
			this.checkallstatus = true;
		} else {
			this.resultdataArray = [];
			this.checkallstatus = false;
		}
		console.log('I am res', this.resultdataArray);

	}
	checkResult(item) {
		if (this.resultdataArray.filter(e => e == item).length > 0) {
			return true;
		}
		return false;
	}
	addInvoiceToledger() {
		console.log("i am invoice ledger", this.resultdataArray);
		if (this.resultdataArray.length > 0)
			this.feeService.addledgertomissinginvoice({ data: this.resultdataArray }).subscribe((res: any) => {
				this.feeService.getMissingInvoiceDetails({ au_login_id: this.loginId, process_type: this.process_type }).subscribe(
					(res: any) => {
						if (res) {
							this.datasource = res;
							this.getFeeLedger(this.loginId);
						}
						else {
							// this.commonAPIService.showSuccessErrorMessage('No Data Fetchecd', 'error');
						}
					}
				)

			})
		else {
			this.commonAPIService.showSuccessErrorMessage('Please Select any Invoice', 'info');
		}

	}

}
