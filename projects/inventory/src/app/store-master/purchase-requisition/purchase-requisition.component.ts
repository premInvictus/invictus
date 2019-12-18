import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Element } from './purchase-requisition.model';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CapitalizePipe } from '../../_pipes';

@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.css']
})
export class PurchaseRequisitionComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  submitParam: any = {};
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
  displayedColumns: string[] = ['position', 'item_code', 'item_name', 'item_quantity', 'pm_intended_use', 'pm_id', 'created_date', 'created_by', 'item_status', 'action'];
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
    this.inventory.getRequistionMaster({ 'pm_type': "PR" }).subscribe((result: any) => {
      if (result) {
        this.requistionArray = result;
        let i = 0;
        const DATA = this.requistionArray.reduce((current, next, index) => {

          next.item_details.forEach(element => {
            let item_quantity = 0;
            let item_status = 'pending';
            next.pm_item_details.forEach(dety => {
              if (dety.item_code === element.item_code) {
                item_quantity = dety.item_quantity;
                item_status = dety.item_status;
              }
            });
            current.push({
              position: { 'count': i, 'pm_id': next.pm_id, 'item_code': element.item_code },
              item_code: element.item_code,
              item_name: element.item_name,
              item_status: item_status,
              item_quantity: item_quantity,
              pm_intended_use: next.pm_intended_use,
              pm_id: next.pm_id,
              created_date: next.pm_created.created_date,
              created_by: next.pm_created.created_by_name,

              action: { 'pm_id': next.pm_id, 'item_code': element.item_code }

            });
            i++;
          });
          return current;
        }, []);
        this.ELEMENT_DATA = DATA;
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        this.pageLength = this.ELEMENT_DATA.length;
        this.dataSource.paginator = this.paginator;
        this.cacheSpan('pm_intended_use', d => d.pm_intended_use);
        this.cacheSpan('pm_id', d => d.pm_id);
        this.cacheSpan('created_date', d => d.created_date);
        this.cacheSpan('created_by', d => d.created_by);
        this.tableDivFlag = true;
        this.tabledataFlag = true;
      }
    });
  }
  approvedList(pm_id, item_code, text) {
    this.submitParam.text = new CapitalizePipe().transform(text + ' Request');
    this.submitParam.pm_id = pm_id;
    this.submitParam.item_code = item_code;
    this.submitParam.action = text;
    this.submitParam.action_performed = 'single'
    this.deleteModal.openModal(this.submitParam);

  }
  finalSubmit($event) {
    if ($event.action_performed === 'single') {
      const tindex = this.requistionArray.findIndex(f => Number(f.pm_id) === Number($event.pm_id));
      if (tindex !== -1) {
        const rindex = this.requistionArray[tindex].pm_item_details.findIndex(r => Number(r.item_code) === Number($event.item_code));
        if ($event.action === 'approved') {
          this.requistionArray[tindex].pm_item_details[rindex].item_status = 'approved';
        } else if ($event.action === 'reject') {
          this.requistionArray[tindex].pm_item_details[rindex].item_status = 'rejected';
        } else if ($event.action === 'hold') {
          this.requistionArray[tindex].pm_item_details[rindex].item_status = 'hold';
        } else if ($event.action === 'esclate') {
          this.requistionArray[tindex].pm_item_details[rindex].item_status = 'esclate';
        }
        if ($event.action !== 'approved') {
          this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
            if (result) {
              this.commonService.showSuccessErrorMessage('Successfully', 'success');
              this.toBePromotedList = [];
              this.getAllRequistionMaster();
            } else {
              this.commonService.showSuccessErrorMessage('Error ', 'error');
            }
          });
        } else {
          this.inventory.setrequisitionArray(this.requistionArray);
          this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
        }
      }
    } else if ($event.action_performed === 'overall') {
      if (this.toBePromotedList.length > 0) {
        for (let item of this.toBePromotedList) {
          const tindex = this.requistionArray.findIndex(f => Number(f.pm_id) === Number(item.pm_id));
          if (tindex !== -1) {
            const rindex = this.requistionArray[tindex].pm_item_details.findIndex(r => Number(r.item_code) === Number(item.item_code));
            if ($event.action === 'approved') {
              this.requistionArray[tindex].pm_item_details[rindex].item_status = 'approved';
            } else if ($event.action === 'reject') {
              this.requistionArray[tindex].pm_item_details[rindex].item_status = 'rejected';
            } else if ($event.action === 'hold') {
              this.requistionArray[tindex].pm_item_details[rindex].item_status = 'hold';
            } else if ($event.action === 'esclate') {
              this.requistionArray[tindex].pm_item_details[rindex].item_status = 'esclate';
            }
          }
        }
      }
      if ($event.action !== 'approved') {
        this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
          if (result) {
            this.commonService.showSuccessErrorMessage('Successfully', 'success');
            this.getAllRequistionMaster();
            this.toBePromotedList = [];
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
  insertIntoToBePromotedList($event, item_code, pm_id) {
    if ($event.checked === true) {
      this.toBePromotedList.push({
        count: $event.source.value,
        item_code: item_code,
        pm_id: pm_id
      });
    } else {
      const findex = this.toBePromotedList.findIndex(f => f.item_code === item_code && f.pm_id == pm_id && f.count === $event.source.value);
      this.toBePromotedList.splice(findex, 1);
    }
  }
  isSelectedP(count) {
    return this.toBePromotedList.findIndex(f => f.count === count) !== -1 ? true : false;
  }
  isDisabledP(item_code) {
    //return this.promoteStudentListArray.findIndex(f => f.au_login_id === login_id && f.pmap_status === '0') !== -1 ? true : false;
  }
  checkAllPromotionList() {
    this.toBePromotedList = [];
    this.allselectedP = this.allselectedP ? false : true;
    if (this.allselectedP) {
      let i = 0;
      for (const item of this.ELEMENT_DATA) {
        this.toBePromotedList.push({
          count: i,
          item_code: item.item_code,
          pm_id: item.pm_id
        });
        i++;
      }
    } else {
      this.toBePromotedList = [];
    }
  }

  overallSubmit(text) {
    this.submitParam.text = new CapitalizePipe().transform(text + ' Request');
    this.submitParam.action = text;
    this.submitParam.action_performed = 'overall';
    this.deleteModal.openModal(this.submitParam);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
