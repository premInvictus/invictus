import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import {VoucherModalComponent} from '../../../fa-shared/voucher-modal/voucher-modal.component';
import {MoveVoucherModalComponent} from '../../../fa-shared/move-voucher-modal/move-voucher-modal.component';
import { VoucherPrintSetupComponent } from '../../voucher-print-setup/voucher-print-setup.component';
import { ItemMasterReportsComponent } from 'projects/inventory/src/app/inventory-reports/item-master-reports/item-master-reports.component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit,AfterViewInit {

  	tableDivFlag = false;
	ELEMENT_DATA: Element[];
	displayedColumns: string[] = ['select', 'vc_date','vc_number', 'vc_type', 'partyname',  'vc_debit','vc_credit','vc_narrations', 'action'];
	dataSource = new MatTableDataSource<Element>();
	selection = new SelectionModel<Element>(true, []);
	@ViewChild('searchModal') searchModal;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	vouchersArray:any[] = [];
	searchData:any;
	session:any;
	globalsetup:any;
	spans = [];
	currentses:any={};

	schoolInfo:any;
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
	constructor(
		  private fbuild: FormBuilder,
		  private sisService: SisService,
		  public commonAPIService: CommonAPIService,
		  private faService:FaService,
		  private dialog: MatDialog,
		  private router: Router,
			private route: ActivatedRoute
	) { }
	
  
	ngOnInit(){
		this.session = JSON.parse(localStorage.getItem('session'));
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getGlobalSetting();
	  this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	  this.tableDivFlag = true;
	  this.getVouchers();
	  this.getSession();
	  this.getSchool();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	resetFilter(){
		this.commonAPIService.state$['filter']={};
		this.commonAPIService.state$['filterText']=[];
		this.getVouchers();
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);

	deleteConfirm(element) {
	  console.log('value--', element);
		var inputJson = {
			vc_id : element.vc_id,
			vc_type:element.vc_tpe,
			vc_number:element.vc_number,
			vc_date:element.vc_date,
			vc_narrations:element.vc_narrations,
			vc_attachments: element.vc_attachments,
			vc_particulars_data: element.vc_particulars_data,
			vc_state : 'delete',
			voucherExists:false
		};
	
		
			this.faService.updateVoucherEntry(inputJson).subscribe((data:any)=>{
				if(data) {
					this.getVouchers();
					this.commonAPIService.showSuccessErrorMessage('Voucher entry Deleted Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Deleting Voucher Entry', 'error');
				}
			});
		
	}
  
	getVouchers() {
		let param:any = {};
		// if(this.searchData && this.searchData.from_date){
		// 	param.from_date = this.searchData.from_date;
		// }
		// if(this.searchData && this.searchData.to_date){
		// 	param.to_date = this.searchData.to_date;
		// }
		this.ELEMENT_DATA = [];
		this.spans = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

		param=this.commonAPIService.state$['filter'] ? this.commonAPIService.state$['filter'] : {};
		  this.faService.getAllVoucherEntry(param).subscribe((data:any)=>{
			  if(data) {
		  this.vouchersArray = data;
		  let element: any = {};        
		  this.ELEMENT_DATA = [];
		  this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		  
			let pos = 1;
			
			for (const item of this.vouchersArray) {
				for (const litem of item.vc_particulars_data) {
					
			  element = {
				srno: pos,
				vc_id: item.vc_id,
				vc_number: item.vc_number,
				vc_type: item.vc_type,
				vc_date:item.vc_date,
				partyname:this.getPartyName(litem),
				vc_narrations: item.vc_narrations,
				// vc_debit: this.calculateDebit(item.vc_particulars_data),
				// vc_credit:this.calculateCredit(item.vc_particulars_data),
				vc_debit : litem.vc_debit,
				vc_credit: litem.vc_credit,
				// status:item.vc_state == 'publish' ? 'published' : item.vc_state,
				action:item
  
			  };
			  this.ELEMENT_DATA.push(element);
			}
			  
			
			pos++;
			}
			//console.log("this.ELEMENT_DATA==>",this.ELEMENT_DATA);
			
				this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				
			
			

				this.cacheSpan('srno', d => d.srno);
				this.cacheSpan('vc_id', d => d.vc_id);
				this.cacheSpan('vc_number', d => d.vc_number);
				this.cacheSpan('vc_type', d => d.vc_type);
				this.cacheSpan('vc_date', d => d.vc_date);
				this.cacheSpan('partyname', d => d.partyname);
				this.cacheSpan('vc_narrations', d => d.vc_narrations);
				// this.cacheSpan('vc_debit', d => d.vc_debit);
				// this.cacheSpan('vc_credit', d => d.vc_credit);
				this.cacheSpan('action', d => d.action);
				this.dataSource.paginator = this.paginator;
				//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
		  
			  } else {
				  this.vouchersArray = [];
			  }
		  })
	}
	getRowSpan(col, index) {
		//console.log('col '+col, 'index'+index, this.spans);
		return this.spans[index] && this.spans[index][col];
	}
	cacheSpan(key, accessor) {
		//console.log(key, accessor);
		for (let i = 0; i < this.ELEMENT_DATA.length;) {
			let currentValue = accessor(this.ELEMENT_DATA[i]);
			let count = 1;
			//console.log('currentValue',currentValue);
			// Iterate through the remaining rows to see how many match
			// the current value as retrieved through the accessor.
			for (let j = i + 1; j < this.ELEMENT_DATA.length; j++) {
				if (currentValue != accessor(this.ELEMENT_DATA[j])) {
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
	calculateDebit(voucherFormGroupArray) {
		var totalDebit = 0;
		for (let i=0; i<voucherFormGroupArray.length;i++) {
			totalDebit= totalDebit+Number(voucherFormGroupArray[i].vc_debit);
		}
		
		return totalDebit;
	}
	getPartyName(voucherFormGroupArray) {
		if (voucherFormGroupArray && voucherFormGroupArray.vc_account_type)
			return voucherFormGroupArray.vc_account_type;
	}

	calculateCredit(voucherFormGroupArray) {
		var totalCredit = 0;
		for (let i=0; i<voucherFormGroupArray.length;i++) {
			totalCredit=totalCredit+Number(voucherFormGroupArray[i].vc_credit);
		}
		return totalCredit;
	}
	
  
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
	  const numSelected = this.selection.selected.length;
	  const numRows = this.dataSource.data.length;
	  return numSelected === numRows;
	}
  
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
	  this.isAllSelected() ?
		  this.selection.clear() :
		  this.dataSource.data.forEach(row => this.selection.select(row));
	}
  
	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: Element): string {
	  if (!row) {
		return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
	  }
	  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.vc_number}`;
	}

	createVoucher() {
		this.router.navigate(['../../transaction-master/voucher-entry'], { queryParams: {}, relativeTo: this.route });
	}

	editVoucher(element) {
		this.router.navigate(['../../transaction-master/voucher-entry'], {  queryParams: { voucher_id: element.vc_id }, relativeTo: this.route });
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	openVoucherModal(value){
		const dialogRef = this.dialog.open(VoucherModalComponent, {
			height: '65vh',
			width: '200vh',
			data: {
				title: value.vc_type + ' voucher',
				vc_id: value.vc_id
			}
		});
		
	}
	toggleVoucherStatus(value) {
		console.log(value);
		if(value.vc_state == 'publish'){
			value.vc_state = 'unpublish';
			this.faService.updateVoucherEntry(value).subscribe((data:any)=>{
				if(data) {
					this.commonAPIService.showSuccessErrorMessage('Voucher entry Unpublished Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Publish Voucher Entry', 'error');
				}
			});
		}
	}
	printvoucher(value){
		console.log(value);
		const param: any = {};
		if(value.vc_id) {
			param.vc_id = value.vc_id;
		}
		this.faService.printvoucher(param).subscribe((result: any) => {
			if (result && result.status == 'ok') {
			  console.log(result.data);
			  this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
				const length = result.data.fileUrl.split('/').length;
				saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
			}
		  });
	}
	printvoucherlist(){
		if(this.vouchersArray.length > 0){
			const param:any={};
			param.filter=this.commonAPIService.state$['filterText'];
			param.vouchersArray = this.vouchersArray;
			this.faService.printvoucherlist(param).subscribe((result: any) => {
				if (result && result.status == 'ok') {
				  console.log(result.data);
				  this.commonAPIService.showSuccessErrorMessage('Download Successfully', 'success');
					const length = result.data.fileUrl.split('/').length;
					saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
				}
			  });
		}
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	openFilter() {

		this.searchModal.openModal();
	}
	searchOk(event){
		console.log(this.router.url);
		console.log(event);
		this.searchData = event;
		this.commonAPIService.state$ = this.commonAPIService.state$ ? this.commonAPIService.state$ : {};
		this.commonAPIService.state$['filter']=event;
		this.getVouchers();
	}
	searchCancel(){

	}

	moveToAnotherSession(data) {
		const dialogRef = this.dialog.open(MoveVoucherModalComponent, {
			// height: '50vh',
			// width: '100vh',
			data: data
		});
		 // Create subscription
		dialogRef.afterClosed().subscribe(() => {
			 this.getVouchers();
		});
	}

	printVoucherSetting() {
		
			const dialogRef = this.dialog.open(VoucherPrintSetupComponent, {
			  width: '45%',
			  height: '65%',
			  data: ''
			});
		
			dialogRef.afterClosed().subscribe(result => {
			  console.log('The dialog was closed');
			});
		  
	}
	getGlobalSetting() {
		let param: any = {};
		this.globalsetup = {};
		param.gs_alias = ['fa_session_freez','fa_monthwise_freez'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.forEach(element => {
					this.globalsetup[element.gs_alias] = element.gs_value
				});
				
				// if (result.data && result.data[0]) {
				// 	this.vcYearlyStatus = Number(result.data[0]['gs_value']);
				// 	console.log('this.vcYearlyStatus', this.vcYearlyStatus)
				// }

			}
		})
	}
	getSession() {
		this.sisService.getSession()
		.subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					for (const citem of result.data) {
						this.sessionArray[citem.ses_id] = citem.ses_name;
						let tdate = new Date();
						const sessionarr = citem.ses_name.split('-');
						var from = new Date(sessionarr[0]+'-04-01');
						var to = new Date(sessionarr[1]+'-03-31');
						if(tdate >= from && tdate <= to) {
							this.currentses['ses_id'] = citem.ses_id;
						}
					}
					this.sessionName = this.sessionArray[this.session.ses_id];
				}
			});
	  }
	  monthwiseFreez(date){
		if(date) {
		  let datearr = date.split('-');
		  if(this.session.ses_id == this.currentses.ses_id) {
			if(this.globalsetup['fa_monthwise_freez'] && this.globalsetup['fa_monthwise_freez'].includes(datearr[1])) {
			  return true;
			}
		  } else {
			return false;
		  }
		}
		return false;
	  }
  	getSchool() {
		this.commonAPIService.getSchoolDetails()
		.subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolInfo = result.data[0];
				}
			});
	}
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({key:'srno'});
		columns.push({key:'vc_date'});
		columns.push({key:'vc_number'});
		columns.push({key:'vc_type'});
		columns.push({key:'partyname'});
		columns.push({key:'vc_debit'});
		columns.push({key:'vc_credit'});

		reportType = new TitleCasePipe().transform('Day Book ' + (this.commonAPIService.state$['filterText'] ? ': '+ this.commonAPIService.state$['filterText'] : ''));
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
	
		worksheet.getCell('A4').value = 'SNo.';
		worksheet.getCell('B4').value = 'Date';
		worksheet.getCell('C4').value = 'Vch No.';
		worksheet.getCell('D4').value = 'Vch Type';
		worksheet.getCell('E4').value = 'Particulars';
		worksheet.getCell('F4').value = 'Debit';
		worksheet.getCell('G4').value = 'Credit';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		let templength = worksheet._rows.length + 1;
		for (const dety of this.ELEMENT_DATA) {
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.srno;
			worksheet.getCell('B' + this.length).value = dety.vc_date;
			worksheet.getCell('C' + this.length).value = dety.vc_number.vc_name;
			worksheet.getCell('D' + this.length).value = dety.vc_type;
			worksheet.getCell('E' + this.length).value = dety.partyname;
			worksheet.getCell('F' + this.length).value = dety.vc_debit ? dety.vc_debit:'';
			worksheet.getCell('G' + this.length).value = dety.vc_credit ? dety.vc_credit : '';
		}
		let i=0;
		console.log('this.ELEMENT_DATA.length',this.ELEMENT_DATA.length);
		while(i<this.ELEMENT_DATA.length) {
			let mergelength = this.ELEMENT_DATA[i].action.vc_particulars_data.length;
			worksheet.mergeCells('A' + (i+templength) + ':' + 'A' + (i+templength + mergelength-1));
			worksheet.mergeCells('B' + (i+templength) + ':' + 'B' + (i+templength + mergelength-1));
			worksheet.mergeCells('C' + (i+templength) + ':' + 'C' + (i+templength + mergelength-1));
			worksheet.mergeCells('D' + (i+templength) + ':' + 'D' + (i+templength + mergelength-1));
			i = i+mergelength;
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
			if (rowNum === 4) {
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
			if (rowNum > 4 && rowNum <= worksheet._rows.length) {
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

		// worksheet.eachRow((row, rowNum) => {
		// 	if (rowNum === worksheet._rows.length) {
		// 		row.eachCell(cell => {
		// 			cell.fill = {
		// 				type: 'pattern',
		// 				pattern: 'solid',
		// 				fgColor: { argb: '004261' },
		// 				bgColor: { argb: '004261' },
		// 			};
		// 			cell.font = {
		// 				color: { argb: 'ffffff' },
		// 				bold: true,
		// 				name: 'Arial',
		// 				size: 10
		// 			};
		// 			cell.border = {
		// 				top: { style: 'thin' },
		// 				left: { style: 'thin' },
		// 				bottom: { style: 'thin' },
		// 				right: { style: 'thin' }
		// 			};
		// 			cell.alignment = { horizontal: 'center' };
		// 		});
		// 	}
		// });
		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
		this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
		+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
		worksheet.getCell('A' + worksheet._rows.length).font = {
		name: 'Arial',
		size: 10,
		bold: true
		};

		worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
		this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
		worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
		worksheet.getCell('A' + worksheet._rows.length).font = {
		name: 'Arial',
		size: 10,
		bold: true
		};
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}

}
