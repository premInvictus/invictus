import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort } from '@angular/material';
import { AddVendorDialog } from './add-vendor-dialog/add-vendor-dialog.component';
import { InvItemDetailsComponent } from '../../inventory-shared/inv-item-details/inv-item-details.component';

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css']
})
export class VendorMasterComponent implements OnInit {
  currentVendorId: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorone') paginatorone: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteModalRef') deleteModalRef;
  vendorListData: any = [];

  VENDOR_LIST_ELEMENT: VendorListElement[] = [];
  vendorlistdataSource = new MatTableDataSource<VendorListElement>(this.VENDOR_LIST_ELEMENT);
  displayedVendorListColumns: string[] = ['srno', 'ven_id','ven_name' , 'ven_category', 'ven_address', 'ven_contact', 'ven_email','action'];

  VENDOR_LOG_LIST_ELEMENT: VendorLogListElement[] = [];
  vendorLogListDataSource = new MatTableDataSource<VendorLogListElement>(this.VENDOR_LOG_LIST_ELEMENT);
  displayedVendorLogListColumns: string[] = ['srno', 'receipt_no','receipt_date' , 'generated_by', 'item_code', 'item_name', 'quantity','description'];


  vendorDetailFlag = false;
  currentVendorDetail:any;
  pageEvent: any;
  spans: any[] = [];
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

  applyFilterVendorLog(filterValue: string) {
    this.vendorLogListDataSource.filter = filterValue.trim().toLowerCase();
  }

  showVendorDetail(element) {
     this.vendorDetailFlag = !this.vendorDetailFlag;
     this.currentVendorDetail = element;
     this.getVendorLogDetails();
  }

  getVendorLogDetails() {
    var inputJson = {
      'pm_vendor.ven_id' : 1
    }
    this.erpCommonService.getVendorLogDetail(inputJson).subscribe((result:any) => {
      let element: any = {};
      let recordArray = [];
      this.VENDOR_LOG_LIST_ELEMENT = [];
      this.vendorLogListDataSource = new MatTableDataSource<VendorLogListElement>(this.VENDOR_LOG_LIST_ELEMENT);
      if (result && result.length > 0) {
        let pos = 1;
				this.vendorLogListDataSource = recordArray = result;
        const DATA = recordArray.reduce((current, next, index) => {
          next.pm_item_details.forEach(element => {
            current.push({
              "srno": index+1,
              "receipt_no": next.pm_id, //next.item_code
              "receipt_date": next && next.pm_created ? next.pm_created.created_date : '',
              "generated_by": next && next.pm_created ? next.pm_created.created_by_name : '',
              "item_code": element.item_code ? element.item_code : '-', 
              "item_name": element.item_name ? element.item_name : '-',
              "quantity": element.item_quantity ? element.item_quantity : '-',
              "item_units": element.item_units ? element.item_units : '',
              "description": element.item_desc ? element.item_desc : '-',
             
            });
          });
         
          return current;
        }, []);

        this.VENDOR_LOG_LIST_ELEMENT = DATA;
        console.log(this.VENDOR_LOG_LIST_ELEMENT);
        this.cacheSpan('srno', d => d.srno);
        this.cacheSpan('receipt_no', d => d.receipt_no);
        this.cacheSpan('receipt_date', d => d.receipt_date);
        this.cacheSpan('generated_by', d => d.generated_by)
        this.vendorLogListDataSource = new MatTableDataSource<VendorLogListElement>(this.VENDOR_LOG_LIST_ELEMENT);
        this.vendorLogListDataSource.paginator = this.paginatorone;
        if (this.sort) {
          this.sort.sortChange.subscribe(() => this.paginatorone.pageIndex = 0);
          this.vendorLogListDataSource.sort = this.sort;
        }
        
			} 
    });
  }

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.VENDOR_LOG_LIST_ELEMENT.length;) {
      let currentValue = accessor(this.VENDOR_LOG_LIST_ELEMENT[i]);
      let count = 1;
      for (let j = i + 1; j < this.VENDOR_LOG_LIST_ELEMENT.length; j++) {
        if (currentValue != accessor(this.VENDOR_LOG_LIST_ELEMENT[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  openItemDetailsModal(item_code) {
		const item: any = {};
		item.item_code = item_code;
		const dialogRef = this.dialog.open(InvItemDetailsComponent, {
			width: '50%',
			height: '500',
			data: item
		});
		dialogRef.afterClosed().subscribe(result => {
		});
  }
  
  backToVendorList() {
    this.vendorDetailFlag = false;
    this.getVendorList();
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


export interface VendorLogListElement {
  srno : number;
  receipt_no : number;
  receipt_date  : string;
  generated_by : string;
  item_code : number;
  item_name : string;
  quantity : string;
  description : string;
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