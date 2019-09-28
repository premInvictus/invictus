import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { AddVendorDialog } from './add-vendor-dialog/add-vendor-dialog.component';
@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css'],
  providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class VendorMasterComponent implements OnInit {
  currentVendorId: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
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

  openModal = (data) => this.deleteModalRef.openModal(data);

	deleteComCancel() { 
    this.deleteModalRef.close();
  }

  openAddVendorDialog(): void {
    const dialogRef = this.dialog.open(AddVendorDialog, {
      width: '750px',
      data: {
        ven_id: '', 
        ven_name: '',
        ven_category: '',
        ven_address: '',
        ven_contact: '',
        ven_email: '',
        showButtonStatus: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getVendorList();

    });
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
					this.VENDOR_LIST_ELEMENT.push(element);
					pos++;
					
				}
				this.vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
			} 
    });
  }

  editVendor(element, buttonStatus) {
    const dialogRef = this.dialog.open(AddVendorDialog, {
      width: '750px',
      data: {
        ven_id: element.ven_id,
        ven_name: element.ven_name,
        ven_category: element.ven_category,
        ven_address: element.ven_address,
        ven_contact: element.ven_contact,
        ven_email: element.ven_email,
        ven_status: element.ven_status,
        showButtonStatus: buttonStatus
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getVendorList();

    });
  }

  deleteVendor(data) {
    console.log('data', data, this.currentVendorId);

    if (this.currentVendorId) {
      this.currentVendorId['vendor_status'] = '5';
      this.erpCommonService.deleteVendor(this.currentVendorId
      ).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          
          this.getVendorList();
        } else {
          this.common.showSuccessErrorMessage(res.message, res.status);
        }
      })
    }


    
  }

  deleteVendorModel(vendor_id) {
    this.currentVendorId = vendor_id;
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


// @Component({
//   selector: 'add-vendor-dialog',
//   templateUrl: 'add-vendor-dialog.html',
// })
// export class AddVendorDialog {

//   constructor(
//     public dialogRef: MatDialogRef<AddVendorDialog>) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

  // addVendorDialog(): void {
  //   const dialogRef = this.dialog.open(AddVendorDialog, {
  //     width: '750px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

// }