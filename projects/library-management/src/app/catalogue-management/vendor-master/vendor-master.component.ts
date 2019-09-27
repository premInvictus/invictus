import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css'],
  providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class VendorMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  vendorListData: any = [];

  VENDOR_LIST_ELEMENT: VendorListElement[] = [];
  vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
  displayedVendorListColumns: string[] = ['srno', 'ven_id','ven_name' , 'ven_category', 'ven_address', 'ven_contact', 'ven_email','action'];
  vendorListPageIndex = 0;
	vendorListPageSize = 10;
	vendorListPageSizeOptions = [10, 25, 50, 100];

  constructor(public dialog: MatDialog, 
    private fbuild: FormBuilder,
    private common: CommonAPIService, 
    private erpCommonService : ErpCommonService) {}

  ngOnInit() {
    this.buildForm();  
    this.getVendorList();
  }

  buildForm() {
    
  }

  getVendorList() {
    const datePipe = new DatePipe('en-in');
   
    this.erpCommonService.getVendorList({}).subscribe((result: any) => {
      // if (res && res.data.length > 0) {
      //   this.verificationLogData = res.data;
        
      // } else {
      //   this.verificationLogData = [];
      // }
      let element: any = {};
      let recordArray = [];
      this.VENDOR_LIST_ELEMENT = [];
      this.vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1;
				this.vendorlistdataSource = recordArray = result.data;
				for (const item of recordArray) {
					element = {
            srno: pos,
            ven_id: item.ven_id,
            ven_name: item.ven_name,
            ven_category: item.ven_category,
            ven_address: item.ven_address,
            ven_contact: item.ven_contact,
            ven_email: item.ven_email,		
          };
          console.log('element', element);
					this.VENDOR_LIST_ELEMENT.push(element);
					pos++;
					
				}
				this.vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
			} 
    });
  }

  getSubscriptionDetails(element) {

  }

}


export interface VendorListElement {
  srno: number;
  ven_id:string;
  ven_name:string;
  ven_category:string;
  ven_address:string;
  ven_contact:string;
  ven_email:string;
}
