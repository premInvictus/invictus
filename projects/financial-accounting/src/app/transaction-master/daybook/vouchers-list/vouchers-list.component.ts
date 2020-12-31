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
import { saveAs } from 'file-saver';
import { VoucherPrintSetupComponent } from '../../voucher-print-setup/voucher-print-setup.component';
import { ItemMasterReportsComponent } from 'projects/inventory/src/app/inventory-reports/item-master-reports/item-master-reports.component';

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
		this.getGlobalSetting();
	  this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	  this.tableDivFlag = true;
	  this.getVouchers();
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
		param.gs_alias = ['fa_session_freez'];
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

}
