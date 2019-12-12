import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './purchase-requisition.model';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.css']
})
export class PurchaseRequisitionComponent implements OnInit {

  requistionArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any = {};
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
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_quantity', 'rm_intended_use', 'rm_id', 'created_date', 'created_by', 'action'];
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
    this.getAllRequistionMaster();
  }
  getRowSpan(col, index) {
    //console.log('col '+col, 'index'+index);
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

  getAllRequistionMaster() {
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.inventory.getAllRequistionMaster().subscribe((result: any) => {
      if (result) {
        this.requistionArray = result;
        const DATA = this.requistionArray.reduce((current, next, index) => {
          next.rm_item_details.forEach(element => {
            current.push({
              position: { 'rm_id': next.rm_id, 'item_code': element.item_code },
              item_code: element.item_code,
              item_name: element.item_name,
              item_quantity: element.item_quantity,
              rm_intended_use: next.rm_intended_use,
              rm_id: next.rm_id,
              created_date: next.rm_created.created_date,
              created_by: next.rm_created.created_by,
              action: { 'rm_id': next.rm_id, 'item_code': element.item_code }
            });
          });
          return current;
        }, []);
        this.ELEMENT_DATA = DATA;
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.cacheSpan('rm_intended_use', d => d.rm_intended_use);
        this.cacheSpan('rm_id', d => d.rm_id);
        this.cacheSpan('created_date', d => d.created_date);
        this.cacheSpan('created_by', d => d.created_by);
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
    });
  }
  approvedList(rm_id, item_code, text) {
    const tindex = this.requistionArray.findIndex(f => Number(f.rm_id) === Number(rm_id));
    if (tindex !== -1) {
      const rindex = this.requistionArray[tindex].rm_item_details.findIndex(r => Number(r.item_code) === Number(item_code));
      if (text === 'approved') {
        this.requistionArray[tindex].rm_item_details[rindex].item_status = 'approved';
      } else if (text === 'reject') {
        this.requistionArray[tindex].rm_item_details[rindex].item_status = 'reject';
      } else if (text === 'hold') {
        this.requistionArray[tindex].rm_item_details[rindex].item_status = 'hold';
      } else if (text === 'esclate') {
        this.requistionArray[tindex].rm_item_details[rindex].item_status = 'esclate';
      }
      if (text !== 'approved') {
        this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
          if (result) {
            this.commonService.showSuccessErrorMessage('Successfylly', 'success');
          } else {
            this.commonService.showSuccessErrorMessage('Error ', 'error');
          }
        });
      } else {
        this.inventory.setrequisitionArray(this.requistionArray);
        this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
      }
    }
  }
  insertIntoToBePromotedList($event, item) {
    if ($event.checked === true) {
      this.toBePromotedList.push({
        item_code: $event.source.value,
        rm_id: item
      });
    } else {
      const findex = this.toBePromotedList.findIndex(f => f.item_code === $event.source.value && f.rm_id == item);
      this.toBePromotedList.splice(findex, 1);
    }
  }
  isSelectedP(item_code) {
    return this.toBePromotedList.findIndex(f => f.item_code === item_code) !== -1 ? true : false;
  }
  isDisabledP(item_code) {
    //return this.promoteStudentListArray.findIndex(f => f.au_login_id === login_id && f.pmap_status === '0') !== -1 ? true : false;
  }
  checkAllPromotionList() {
    this.toBePromotedList = [];
    this.allselectedP = this.allselectedP ? false : true;
    if (this.allselectedP) {
      for (const item of this.ELEMENT_DATA) {
        this.toBePromotedList.push({
          item_code: item.item_code,
          rm_id: item.rm_id
        });
      }
    } else {
      this.toBePromotedList = [];
    }
  }
  overallSubmit(text) {
    if (this.toBePromotedList.length > 0) {
      for (let item of this.toBePromotedList) {
        const tindex = this.requistionArray.findIndex(f => Number(f.rm_id) === Number(item.rm_id));
        if (tindex !== -1) {
          const rindex = this.requistionArray[tindex].rm_item_details.findIndex(r => Number(r.item_code) === Number(item.item_code));
          if (text === 'approved') {
            this.requistionArray[tindex].rm_item_details[rindex].item_status = 'approved';
          } else if (text === 'reject') {
            this.requistionArray[tindex].rm_item_details[rindex].item_status = 'reject';
          } else if (text === 'hold') {
            this.requistionArray[tindex].rm_item_details[rindex].item_status = 'hold';
          } else if (text === 'esclate') {
            this.requistionArray[tindex].rm_item_details[rindex].item_status = 'esclate';
          }
        }
      }
    }
    if (text !== 'approved') {
      this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
        if (result) {
          this.commonService.showSuccessErrorMessage('Successfylly', 'success');
        } else {
          this.commonService.showSuccessErrorMessage('Error ', 'error');
        }
      });
    } else {
      this.inventory.setrequisitionArray(this.requistionArray);
      this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
    }
    console.log(this.requistionArray);
  }

}
