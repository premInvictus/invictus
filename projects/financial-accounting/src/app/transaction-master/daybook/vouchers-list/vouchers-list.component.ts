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
@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit,AfterViewInit {

  	tableDivFlag = false;
	ELEMENT_DATA: Element[];
	displayedColumns: string[] = ['select', 'vc_date','vc_number', 'vc_type', 'partyname', 'vc_narrations', 'vc_debit', 'action'];
	dataSource = new MatTableDataSource<Element>();
	selection = new SelectionModel<Element>(true, []);
	@ViewChild('searchModal') searchModal;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	vouchersArray:any[] = [];
	searchData:any;
	constructor(
		  private fbuild: FormBuilder,
		  private sisService: SisService,
		  private commonAPIService: CommonAPIService,
		  private faService:FaService,
		  private dialog: MatDialog,
		  private router: Router,
			private route: ActivatedRoute
	) { }
	
  
	ngOnInit(){
	  this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	  this.tableDivFlag = true;
	  this.getVouchers();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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
			vc_state : 'delete'
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
		const param:any = {};
		if(this.searchData && this.searchData.from_date){
			param.from_date = this.searchData.from_date;
		}
		if(this.searchData && this.searchData.to_date){
			param.to_date = this.searchData.to_date;
		}
		  this.faService.getAllVoucherEntry(param).subscribe((data:any)=>{
			  if(data) {
		  this.vouchersArray = data;
		  let element: any = {};        
		  this.ELEMENT_DATA = [];
		  this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		  
			let pos = 1;
			
			for (const item of this.vouchersArray) {
			  element = {
				srno: pos,
				vc_id: item.vc_id,
				vc_number: item.vc_number,
				vc_type: item.vc_type,
				vc_date:item.vc_date,
				partyname:this.getPartyName(item.vc_particulars_data),
				vc_narrations: item.vc_narrations,
				vc_debit: this.calculateDebit(item.vc_particulars_data),
				vc_credit:this.calculateCredit(item.vc_particulars_data),
				// status:item.vc_state == 'publish' ? 'published' : item.vc_state,
				action:item
  
			  };
			  this.ELEMENT_DATA.push(element);
			  pos++;
			  
			}
			this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
				this.dataSource.paginator = this.paginator;
				//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
				this.dataSource.sort = this.sort;
		  
			  } else {
				  this.vouchersArray = [];
			  }
		  })
	}

	calculateDebit(voucherFormGroupArray) {
		var totalDebit = 0;
		for (let i=0; i<voucherFormGroupArray.length;i++) {
			totalDebit= totalDebit+Number(voucherFormGroupArray[i].vc_debit);
		}
		
		return totalDebit;
	}
	getPartyName(voucherFormGroupArray) {
		if (voucherFormGroupArray && voucherFormGroupArray[0])
			return voucherFormGroupArray[0].vc_account_type;
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
			height: '50vh',
			width: '100vh',
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
		console.log(event);
		this.searchData = event;
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

}
