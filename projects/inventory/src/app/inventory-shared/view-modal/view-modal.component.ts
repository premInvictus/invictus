import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { ViewModal } from './view-modal.model';
import { InventoryService } from '../../_services';
@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
  styleUrls: ['./view-modal.component.css']
})
export class ViewModalComponent implements OnInit {
  inputData: any;
  vendor_name: any;
  vendor_contact: any;
  vendor_category: any;
  vendor_email: any;
  receipt_no: any;
  recipt_date: any;
  created_by: any;
  ELEMENT_DATA: any[] = [];
  locations: any[] = [];
  dialogRef: MatDialogRef<ViewModalComponent>;
  @ViewChild('viewModal') viewModal;
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_quantity', 'item_category', 'item_location'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  constructor(private dialog: MatDialog, public inventory: InventoryService) { }
  ngOnInit() {
  }


  
  openModal(data) {
    this.ELEMENT_DATA = [];
    this.locations = [];
    this.inputData = data;
    this.inputData.pm_type = 'GR';

    console.log(data);

    data.inv_item_details.forEach(element => {
      let ind = 0;
      this.ELEMENT_DATA.push({
        "position": ind + 1,
        "item_code": element.item_code,
        "item_name": element.item_name,
        "item_category": element.item_type_details.item_category.name,
        "item_quantity": element.item_quantity + " " +element.item_units,
        "item_location": element.location_name
      });  
      ind++;
      this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
      this.dialogRef = this.dialog.open(this.viewModal, {
        'height': '50vh',
        'width': '100vh',
        position: {
          'top': '10%'
        }
      });

    });

    // this.inventory.getRequistionMaster({pm_id : data}).subscribe((result: any) => {
    //   console.log("get PO >>>>>>>> ", result);
    //   if (result) {
    //     let ind = 0;
    //     this.vendor_name = result[0].pm_vendor.ven_name ? result[0].pm_vendor.ven_name : '-';
    //     this.vendor_contact = result[0].pm_vendor.ven_contact ? result[0].pm_vendor.ven_contact : '-';
    //     this.vendor_category = result[0].pm_vendor.ven_category ? result[0].pm_vendor.ven_category : '-';
    //     this.vendor_email = result[0].pm_vendor.ven_email ? result[0].pm_vendor.ven_email : '-';
    //     this.receipt_no = result[0].pm_id ? result[0].pm_id : '-';
    //     this.recipt_date = result[0].pm_created.created_date ? result[0].pm_created.created_date : '-';
    //     this.created_by = result[0].pm_created.created_by_name ? result[0].pm_created.created_by_name : '-';
    //     this.locations = result[0].locs && result[0].locs.length > 0 ? result[0].locs : []
    //     for (const item of result[0].pm_item_details) {
    //       this.ELEMENT_DATA.push({
    //         "position": ind + 1,
    //         "item_code": item.item_code,
    //         "item_name": item.item_name,
    //         "item_category": item.item_category,
    //         "item_quantity": item.item_quantity,
    //         "item_location": item.item_location
    //       });
    //       ind++;
    //     }
    //     this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    //     this.dialogRef = this.dialog.open(this.viewModal, {
    //       'height': '50vh',
    //       'width': '100vh',
    //       position: {
    //         'top': '10%'
    //       }
    //     });
    //   }
    // });
  }
  getLocationName(loc_id) {
    if (this.locations.length > 0) {
    const index = this.locations.findIndex(f => Number(f.location_id) === Number(loc_id));
    if (index !== -1) {
      return this.locations[index].location_name;
    }
    } else {
      return '-';
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }

}

