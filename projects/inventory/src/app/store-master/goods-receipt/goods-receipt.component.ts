import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './goods-receipt.model';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  @ViewChild('receiptModal') receiptModal;
  orderArray: any[] = [];
  setArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalOrderArray: any = {};
  toBePromotedList: any[] = [];
  tableDivFlag = false;
  tabledataFlag = false;
  update_id: any;
  currentUser: any;
  session: any;
  ELEMENT_DATA: any[] = [];
  schoolInfo: any;
  pageLength: number;
  pageSize = 300;
  pageSizeOptions = [100, 300, 1000];
  submitParam: any = {};
  displayedColumns: string[] = ['position', 'po_number', 'po_date', 'created_by', 'vendor_id', 'vendor_name',
    'vendor_category', 'vendor_contact', 'vendor_email', 'action'];
  dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  spans = [];
  allselectedP = false;
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getSchool();
    this.getAllOrderMaster();
  }
  getSchool() {
    this.sisService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  getAllOrderMaster() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventory.getOrderMaster({ 'pm_type': "GR" }).subscribe((result: any) => {
      if (result) {
        this.orderArray = result;
        let ind = 0;
        for (const item of this.orderArray) {
          this.ELEMENT_DATA.push({
            "position": ind + 1,
            "po_number": item.pm_id,
            "po_date": item.pm_created ? item.pm_created.created_date : '-',
            "created_by": item.pm_created ? item.pm_created.created_by_name : '-',
            "vendor_id": item.pm_vendor ? item.pm_vendor.ven_id : '-',
            "vendor_name": item.pm_vendor ? item.pm_vendor.ven_name : '-',
            "vendor_category": item.pm_vendor ? item.pm_vendor.ven_category : '-',
            "vendor_contact": item.pm_vendor ? item.pm_vendor.ven_contact : '-',
            "vendor_email": item.pm_vendor ? item.pm_vendor.ven_email : '-',
            "print": { 'pm_id': item.pm_id, 'pm_status': item.pm_status },
            "action": { 'pm_id': item.pm_id, 'pm_status': item.pm_status }
          });
          ind++;
        }
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
    });
  }
  actionList(pm_id, action) {
    const sindex = this.orderArray.findIndex(f => Number(f.pm_id) === Number(pm_id));
    let update_data : any[] = [];
    if (sindex !== -1) {
      if (action === 'edit') {
        console.log('orders ', this.orderArray[sindex]);
        
        this.setArray.push(this.orderArray[sindex]);
        this.inventory.setrequisitionArray(this.setArray);
        this.router.navigate(['../generate-receipt'], { relativeTo: this.route });
      } else if (action === 'view') {        
        this.submitParam.pm_id = pm_id;
        this.receiptModal.openModal(this.submitParam);
      } else if (action === 'delete'){        
        this.orderArray[sindex].pm_status = 'deleted';
        update_data.push(this.orderArray[sindex]);
        console.log('deleteingnngngng', update_data);        
        this.inventory.updateRequistionMaster(update_data).subscribe((result: any) => {
          console.log(result);
          if(result.ok){
            this.getAllOrderMaster();
            this.commonService.showSuccessErrorMessage('Receipt Deleted Successfully', 'success');
          }else{
            this.commonService.showSuccessErrorMessage('Receipt couldn\'t be deleted', 'error');
          }
        });
      }
    }
  }
  printReceipt(pm_id) {
    const sindex = this.orderArray.findIndex(f => Number(f.pm_id) === Number(pm_id));
    let update_data : any[] = [];
    if (sindex !== -1) {  
      console.log("pm id ", this.orderArray[sindex]);

        let tempDate = this.orderArray[sindex].pm_created.created_date.split(",")[0].split(" ");
        let prepDate = tempDate[1]+"-"+tempDate[0]+"-"+tempDate[2];
        const JSON = {
          "bill_id": this.orderArray[sindex].pm_id,
          "bill_type": "Goods Receipt Note",
          "bill_date": prepDate,
          "remarks": this.orderArray[sindex].pm_intended_use,
          "bill_created_by": this.orderArray[sindex].pm_created.created_by_name,
          "bill_details": this.orderArray[sindex].pm_item_details,
          "school_name": this.schoolInfo.school_name,
          "school_logo": this.schoolInfo.school_logo,
          "school_address": this.schoolInfo.school_address,
          "school_phone": this.schoolInfo.school_phone,
          "school_city":  this.schoolInfo.school_city,
          "school_state":  this.schoolInfo.school_state,
          "school_afflication_no":  this.schoolInfo.school_afflication_no,
          "school_website":  this.schoolInfo.school_website,
          "name": "",
          "vendor_name": this.orderArray[sindex].pm_vendor.ven_name,
          "vendor_phone": this.orderArray[sindex].pm_vendor.ven_phone,
          "po_no": this.orderArray[sindex].pm_details.purchase_order_id,
          "invoice_no": this.orderArray[sindex].pm_details.invoice_no,
          "grand_total": this.orderArray[sindex].pm_details.po_total,
      };
        this.inventory.printGoodsReceipt(JSON).subscribe((print_result: any) => {
          if (print_result) {      
            this.orderArray[sindex].pm_status = 'approved';
            update_data.push(this.orderArray[sindex]);
            console.log('deleteingnngngng', update_data);  
            this.inventory.updateRequistionMaster(update_data).subscribe((result: any) => {
              console.log(result);
              if(result.ok){
                this.getAllOrderMaster();
                this.commonService.showSuccessErrorMessage('Receipt Update Successfully', 'success');
                saveAs(print_result.data.fileUrl, print_result.data.fileName);
                this.commonService.showSuccessErrorMessage('Receipt Print Successful', 'success');
              }else{
                this.commonService.showSuccessErrorMessage('Receipt couldn\'t be updated', 'error');
              }
            });
          }
        });
      
      // let receiptArray: any = {};
      // receiptArray['receipt_no'] = this.orderArray[sindex].pm_id;
      // receiptArray['date'] =this.commonService.dateConvertion(this.orderArray[sindex].pm_updated.update_date,'dd-MMM-y');
      // receiptArray['vendor_name'] = this.orderArray[sindex].pm_vendor.ven_name;
      // receiptArray['po_no'] = this.orderArray[sindex].pm_details.purchase_order_id;
      // receiptArray['invoice_no'] = this.orderArray[sindex].pm_details.invoice_no;
      // receiptArray['school_name'] = this.schoolInfo.school_name;
      // receiptArray['school_logo'] = this.schoolInfo.school_logo;
      // receiptArray['school_address'] = this.schoolInfo.school_address;
      // this.inventory.generatePdfOfReceipt(receiptArray).subscribe((result: any) => {
      //   if (result && result.status == 'ok') {
      //     this.commonService.showSuccessErrorMessage(result.message, 'success');
      //     const length = result.data.fileUrl.split('/').length;
      //     saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
      //   }
      // });
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

