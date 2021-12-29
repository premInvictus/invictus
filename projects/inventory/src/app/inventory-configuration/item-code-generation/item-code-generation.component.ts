import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InventoryService, CommonAPIService } from '../../_services';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material';
import { MatPaginatorI18n } from '../../inventory-shared/customPaginatorClass';
@Component({
  selector: 'app-item-code-generation',
  templateUrl: './item-code-generation.component.html',
  styleUrls: ['./item-code-generation.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
  ]
})
export class ItemCodeGenerationComponent implements OnInit, AfterViewInit {
  itemCodeForm: FormGroup;
  natureArray: any[] = [];
  categoryArray: any[] = [];
  unitsArray: any[] = [];
  updateFlag = false;
  ITEM_MASTER_DATA: any[] = [];
  itempagesize = 100;
  totalRecords: any;
  pageIndex = 0;
  pageEvent: PageEvent;
  pageSize = 100;
  currentUser: any = {};
  itempagesizeoptions = [100, 300, 500, 1000];
  datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
  disabledApiButton = false;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('delete') deleteModal;
  displayedColumns = ['sno', 'code', 'name', 'nature', 'category', 'reorder', 'desc', 'action'];
  constructor(private fbuild: FormBuilder,
    private service: InventoryService,
    private common: CommonAPIService) { }

  ngOnInit() {
    localStorage.removeItem('invoiceBulkRecords');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.buildform();
    this.getItemCategory();
    this.getItemNature();
    this.getItemUnits();
    this.getAllItemsFromMaster();
  }
  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
  }
  buildform() {
    this.itemCodeForm = this.fbuild.group({
      "item_name": "",
      "item_session": "",
      "item_nature": "",
      "item_category": "",
      "item_reorder_level": "",
      "item_units": "",
      "item_desc": "",
      "item_status": "",
      "item_code": "",
      "item_created_date": "",
      "item_updated_date": ""
    });
  }
  getItemNature() {
    this.service.getDroppableFromMaster({
      type_id: '8'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.natureArray = res;
      } else {
        this.natureArray = [];
      }
    });
  }
  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllItemsFromMaster();
    return event;
  }
  getItemCategory() {
    this.service.getDroppableFromMaster({
      type_id: '9'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.categoryArray = res;
      } else {
        this.categoryArray = [];
      }
    });
  }
  openDeleteDialog(data) {
    this.deleteModal.openModal(data);
  }
  getItemUnits() {
    this.service.getDroppableFromMaster({
      type_id: '10'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.unitsArray = res;
      } else {
        this.unitsArray = [];
      }
    });
  }
  getAllItemsFromMaster() {
    this.ITEM_MASTER_DATA = [];
    this.datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
    const json = {
      page_index: this.pageIndex,
      page_size: this.pageSize,
      item_status: 'active'
    };
    this.service.getAllItemsFromMaster(json).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        let ind = 0;
        for (const item of res.data) {
          this.ITEM_MASTER_DATA.push({
            "sno": ind + 1,
            "code": item.item_code,
            "name": item.item_name,
            "session": item.item_session,
            "nature": item.item_nature.id,
            "category": item.item_category.id,
            "reorder": item.item_reorder_level,
            "units": item.item_units.id,
            "desc": item.item_desc,
            "status": item.item_status,
            "action": item
          });
          ind++;
        }
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.ITEM_MASTER_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
      }
    });
  }
  getNatureName(id) {
    const findex = this.natureArray.findIndex(f => Number(f.config_id) === Number(id));
    if (findex !== -1) {
      return this.natureArray[findex]['name'];
    }
  }
  getConsumable(id) {
    const findex = this.natureArray.findIndex(f => Number(f.config_id) === Number(id));
    if (findex !== -1) {
      return this.natureArray[findex]['is_consumable'];
    }
  }
  getCategoryName(id) {
    const findex = this.categoryArray.findIndex(f => Number(f.config_id) === Number(id));
    if (findex !== -1) {
      return this.categoryArray[findex]['name'];
    }
  }
  getUnitsName(id) {
    const findex = this.unitsArray.findIndex(f => Number(f.config_id) === Number(id));
    if (findex !== -1) {
      return this.unitsArray[findex]['name'];
    } else {
      return '';
    }
  }
  resetForm() {
    this.itemCodeForm.reset();
  }
  cancelForm() {
    this.updateFlag = false;
    this.resetForm();
  }
  saveForm() {
    if (this.itemCodeForm.valid) {
      this.disabledApiButton = true;
      if (!this.updateFlag) {
        let inputJSON = {};
        inputJSON['item_code'] = '';
        inputJSON['item_name'] = this.itemCodeForm.value.item_name;
        inputJSON['item_nature'] = {
          name: this.getNatureName(this.itemCodeForm.value.item_nature),
          id: this.itemCodeForm.value.item_nature,
          is_consumable: this.getConsumable(this.itemCodeForm.value.item_nature),
        };
        inputJSON['item_category'] = {
          name: this.getCategoryName(this.itemCodeForm.value.item_category),
          id: this.itemCodeForm.value.item_category
        };
        inputJSON['item_units'] = {
          name: this.getUnitsName(this.itemCodeForm.value.item_units),
          id: this.itemCodeForm.value.item_units
        };
        inputJSON['item_reorder_level'] = this.itemCodeForm.value.item_reorder_level;
        inputJSON['item_desc'] = this.itemCodeForm.value.item_desc;
        inputJSON['item_status'] = 'active';
        inputJSON['item_location'] = [{
          location_id: 0,
          item_qty: 0
        }];
        inputJSON['item_created_date'] = '';
        inputJSON['item_updated_date'] = '';
        inputJSON['item_created_by'] = {
          name: this.currentUser.full_name,
          id: this.currentUser.login_id
        }
        inputJSON['item_updated_by'] = {
          name: this.currentUser.full_name,
          id: this.currentUser.login_id
        }
        this.service.insertItemsMaster(inputJSON).subscribe((res: any) => {
          this.disabledApiButton = false;
          if (res && res.status === 'ok') {
            this.common.showSuccessErrorMessage('Item generated successfully', 'success');
            this.getAllItemsFromMaster();
            this.itemCodeForm.reset();
          } else {
            this.common.showSuccessErrorMessage('Duplicate item cannot be generated', 'error');
            this.getAllItemsFromMaster();
            this.itemCodeForm.reset();
          }
        });
      } else {
        let inputJSON = {};
        console.log(this.getConsumable(this.itemCodeForm.value.item_nature));
        inputJSON['item_code'] = this.itemCodeForm.value.item_code;
        inputJSON['item_name'] = this.itemCodeForm.value.item_name;
        inputJSON['item_nature'] = {
          name: this.getNatureName(this.itemCodeForm.value.item_nature),
          id: this.itemCodeForm.value.item_nature,
          is_consumable: this.getConsumable(this.itemCodeForm.value.item_nature),
        };
        inputJSON['item_category'] = {
          name: this.getCategoryName(this.itemCodeForm.value.item_category),
          id: this.itemCodeForm.value.item_category
        };
        inputJSON['item_units'] = {
          name: this.getUnitsName(this.itemCodeForm.value.item_units),
          id: this.itemCodeForm.value.item_units
        };
        inputJSON['item_reorder_level'] = this.itemCodeForm.value.item_reorder_level;
        inputJSON['item_desc'] = this.itemCodeForm.value.item_desc;
        inputJSON['item_updated_date'] = this.itemCodeForm.value.item_updated_date;
        inputJSON['item_updated_by'] = {
          name: this.currentUser.full_name,
          id: this.currentUser.login_id
        }
        this.service.updateItemsMaster(inputJSON).subscribe((res: any) => {
          this.disabledApiButton = false;
          if (res && res.status === 'ok') {
            this.common.showSuccessErrorMessage('Item Updated successfully', 'success');
            this.getAllItemsFromMaster();
            this.updateFlag = false;
            this.itemCodeForm.reset();
          } else {
            this.common.showSuccessErrorMessage('Item cannot be updated', 'error');
            this.itemCodeForm.reset();
            this.updateFlag = false;
          }
        });
      }
    } else {
      this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  editItem(val) {
    this.itemCodeForm.patchValue({
      "item_name": val.item_name,
      "item_nature": val.item_nature.id,
      "item_category": val.item_category.id,
      "item_reorder_level": val.item_reorder_level,
      "item_units": val.item_units.id,
      "item_desc": val.item_desc,
      "item_code": val.item_code,
      "item_updated_date": val.item_updated_date
    });
    this.updateFlag = true;
  }
  deleteItem($event) {
    if ($event) {
      let inputJSON = {};
      inputJSON['item_code'] = $event['item_code'];
      inputJSON['item_status'] = 'deleted';
      this.service.updateItemsMaster(inputJSON).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.common.showSuccessErrorMessage('Item Deleted successfully', 'success');
          this.getAllItemsFromMaster();
          this.itemCodeForm.reset();
        } else {
          this.common.showSuccessErrorMessage('Error to delete', 'error');
          this.itemCodeForm.reset();
          this.updateFlag = false;
        }
      });
    }
  }
  cancel($event) {
    if ($event) {
      this.deleteModal.closeDialog();
    }
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

}
