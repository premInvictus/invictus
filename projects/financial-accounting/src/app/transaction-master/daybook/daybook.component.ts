
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-daybook',
	templateUrl: './daybook.component.html',
	styleUrls: ['./daybook.component.scss']
})
export class DaybookComponent implements OnInit {
	
	tableDivFlag = false;
	ELEMENT_DATA: Element[];
	displayedColumns: string[] = ['select', 'vc_number', 'vc_type','vc_date', 'vc_narrations', 'vc_debit', 'vc_credit', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>();
	selection = new SelectionModel<Element>(true, []);
	vouchersArray:any[] = [];
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
  
	getVouchers() {
		  this.faService.getAllVoucherEntry({}).subscribe((data:any)=>{
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
				vc_narrations: item.vc_narrations,
				vc_debit: this.calculateDebit(item.vc_particulars_data),
				vc_credit:this.calculateCredit(item.vc_particulars_data),
				status:item.vc_state,
				action:item
  
			  };
			  this.ELEMENT_DATA.push(element);
			  pos++;
			  
			}
			this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		  
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
}