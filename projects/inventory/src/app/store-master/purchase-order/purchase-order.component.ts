import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './purchase-order.model';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
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
  pageLength: number;
  pageSize = 300;
  pageSizeOptions = [100, 300, 1000];
  displayedColumns: string[] = ['position', 'po_number', 'po_date', 'created_by', 'vendor_id', 'vendor_name',
    'vendor_category', 'action'];
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
    this.getAllOrderMaster();
  }
  getAllOrderMaster() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventory.getOrderMaster({ 'pm_type': "PO" }).subscribe((result: any) => {
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
            "action": item.pm_id
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
    if (sindex !== -1) {
      if (action === 'delete') {
        this.orderArray.splice(sindex, 1);
      } else if (action === 'edit') {
        this.setArray.push(this.orderArray[sindex]);
        this.inventory.setrequisitionArray(this.setArray);
        this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
      }
    }
  }
  editList(pm_id) {
    const sindex = this.orderArray.findIndex(f => Number(f.pm_id) === Number(pm_id));
    if (sindex !== -1) {
      this.orderArray.splice(sindex, 1);
    }
  }
}
