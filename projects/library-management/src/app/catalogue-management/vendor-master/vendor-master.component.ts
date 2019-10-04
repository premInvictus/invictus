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
  styleUrls: ['./vendor-master.component.css']
})
export class VendorMasterComponent implements OnInit {
  currentVendorId: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
  vendorListData: any = [];

  VENDOR_LIST_ELEMENT: VendorListElement[] = [];
  vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
  displayedVendorListColumns: string[] = ['srno', 'ven_id','ven_name' , 'ven_category', 'ven_address', 'ven_contact', 'ven_email','action'];
  
  pageEvent: any;

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
      this.getVendorList();

    });
  }

  getVendorList() {
    const datePipe = new DatePipe('en-in');
   
    this.erpCommonService.getVendorList({}).subscribe((result: any) => {
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
            ven_frequency: item.ven_frequency ? item.ven_frequency : '',
            ven_items_tags: item.ven_items_tags ? item.ven_items_tags : '',
            ven_authorised_person_detail_name : item.ven_authorised_person_detail_name ? item.ven_authorised_person_detail_name : '',
            ven_authorised_person_detail_designation : item.ven_authorised_person_detail_designation ? item.ven_authorised_person_detail_designation : '',
            ven_authorised_person_detail_contact : item.ven_authorised_person_detail_contact ? item.ven_authorised_person_detail_contact : '',
            ven_pan_no : item.ven_pan_no ? item.ven_pan_no : '',
            ven_gst_no : item.ven_gst_no ? item.ven_gst_no : '',
            ven_status: item.ven_status ? item.ven_status : '1',
            ven_created_date: item.ven_created_date ? item.ven_created_date : '',
            ven_updated_date: item.ven_updated_date ? item.ven_updated_date : '',
          };
					this.VENDOR_LIST_ELEMENT.push(element);
					pos++;
					
				}
        this.vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
        this.vendorlistdataSource.paginator = this.paginator;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.vendorlistdataSource.sort = this.sort;
        }
        
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
        ven_frequency: element.ven_frequency ? element.ven_frequency : '',
        ven_items_tags: element.ven_items_tags ? element.ven_items_tags : '',
        ven_authorised_person_detail_name : element.ven_authorised_person_detail_name ? element.ven_authorised_person_detail_name : '',
        ven_authorised_person_detail_designation : element.ven_authorised_person_detail_designation ? element.ven_authorised_person_detail_designation : '',
        ven_authorised_person_detail_contact : element.ven_authorised_person_detail_contact ? element.ven_authorised_person_detail_contact : '',
        ven_pan_no : element.ven_pan_no ? element.ven_pan_no : '',
        ven_gst_no : element.ven_gst_no ? element.ven_gst_no : '',
        ven_status: element.ven_status ? element.ven_status : '1',
        ven_created_date: element.ven_created_date ? element.ven_created_date : '',
        ven_updated_date: element.ven_updated_date ? element.ven_updated_date : '',
        showButtonStatus: buttonStatus ? buttonStatus : false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getVendorList();

    });
  }

  

  deleteVendor(data) {
    if (this.currentVendorId) {
      this.currentVendorId['ven_status'] = '5';
      this.erpCommonService.deleteVendor(this.currentVendorId).subscribe((res: any) => {
        if (res && res.status === 'ok') {     
          this.common.showSuccessErrorMessage(res.message, res.status);     
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

  applyFilterVendor(filterValue: string) {
		this.vendorlistdataSource.filter = filterValue.trim().toLowerCase();
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