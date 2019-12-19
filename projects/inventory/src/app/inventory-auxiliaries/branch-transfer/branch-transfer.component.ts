import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { ErpCommonService } from 'src/app/_services';
@Component({
  selector: 'app-branch-transfer',
  templateUrl: './branch-transfer.component.html',
  styleUrls: ['./branch-transfer.component.css']
})
export class BranchTransferComponent implements OnInit {
  createNewFlag = false;
  bt_id: any;
  item_det: any = {};
  qty: any;
  itemArray2: any[];
  qty2: any;
  constructor(private service: InventoryService,
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    private erp: ErpCommonService,
    public axiomService: AxiomService,
    public sisService: SisService, ) { }
  branchArray: any[] = [];
  deleteFlag = false;
  displayedColumns: any[] = ['srno', 'date', 'created_by', 'branch_name', 'action'];
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('messageModal') messageModal;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  submitParam: any = {};
  createRequistionForm: FormGroup;
  finalRequistionForm: FormGroup;
  itempagesize = 100;
  totalRecords: any;
  itempagesizeoptions = [100, 300, 500, 1000];
  pageIndex = 0;
  pageEvent: PageEvent;
  pageSize = 100;
  itemArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any[] = [];
  finalSubmitArray: any = {};
  UpdateFlag = false;
  update_id: any;
  currentUser: any = {};
  session: any;
  editBranchtransfer = false;
  genFlag = false;
  BRANCH_TRANSFER_DATA: any[] = [];
  schoolInfo: any = {};
  locations: any[] = [];
  datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getBranch();
    this.getBranchTransferData();
    this.getSchool();
    this.buildForm();
  }
  getSchool() {
    this.erp.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        console.log(this.schoolInfo);
      }
    });
  }
  buildForm() {
    this.createRequistionForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: '',
      item_status: '',
      item_type_details: '',
      location: '',
      location_name: ''

    });
    this.finalRequistionForm = this.fbuild.group({
      intended_use: '',
    });

  }
  createNewBranchTransfer() {
    this.locations = [];
    this.createNewFlag = true;
    this.finalRequistionArray = [];
    this.itemArray = [];
    this.itemCodeArray = [];
    this.deleteFlag = false;
    this.finalRequistionForm.reset();
    this.createRequistionForm.reset();
    this.editBranchtransfer = false;
    this.itemArray2 = [];
  }

  goBack() {
    this.createNewFlag = false;
    this.deleteFlag = false;
    this.BRANCH_TRANSFER_DATA = [];

    this.datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
    this.getBranchTransferData();
    this
    this.editBranchtransfer = false;
  }
  getBranch() {
    this.branchArray = [];
    this.service.getBranch({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.branchArray = result.data;
      }
    });
  }
  filterItem($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        this.itemArray = [];
        this.service.filterItemsFromMaster(
          {
            "filters": [
              {
                "filter_type": "item_name",
                "filter_value": $event.target.value,
                "type": "text"
              }
            ],
            page_index: 0,
            page_size: ''
          }
        ).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.itemArray = result.data;
          }
        });
      }
    }
  }
  getItems2(val) {
    this.itemArray2 = [];
    this.qty2 = '';
    this.service.filterItemsFromMaster(
      {
        "filters": [
          {
            "filter_type": "item_code",
            "filter_value": val.item_code,
            "type": "text"
          }
        ],
        page_index: 0,
        page_size: ''
      }
    ).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.itemArray2 = result.data;
        this.getQuantityBasedOnLocation2(val, this.itemArray2);
        this.createRequistionForm.patchValue({
          'item_code': val.item_code,
          'item_name': val.item_name,
          'item_desc': val.item_desc,
          'item_quantity': val.item_quantity,
          'item_units': val.item_units,
          'location': val.location,
          'location_name': this.getLocationName(Number(val.location)),
          item_type_details: {
            item_category: val.item_category,
            item_nature: val.item_nature
          }
        });
      }
    });
  }
  getItemPerId(item: any) {
    this.locations = [];
    this.service.filterItemsFromMaster(
      {
        "filters": [
          {
            "filter_type": "item_code",
            "filter_value": Number(item.item_code),
            "type": "text"
          }
        ],
        page_index: 0,
        page_size: ''
      }
    ).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.locations = result.data[0].locs
      }
    });
    this.itemCode = item.item_code;
    this.createRequistionForm.patchValue({
      item_name: item.item_name,
      item_desc: item.item_desc,
      item_units: item.item_units.name,
      item_type_details: {
        item_category: item.item_category,
        item_nature: item.item_nature
      }
    });
  }
  getQuantityBasedOnLocation($event) {
    if (!this.editBranchtransfer) {
      const sindex = this.itemArray.findIndex(f => Number(f.item_code) === Number(this.createRequistionForm.value.item_code));
      if (sindex !== -1) {
        const lindex = this.itemArray[sindex].item_location.findIndex(f => Number(f.location_id) === Number($event.value));
        if (lindex !== -1) {
          this.qty = Number(this.itemArray[sindex].item_location[lindex].item_qty);
          this.createRequistionForm.patchValue({
            item_quantity: this.qty,
            location: Number($event.value),
            location_name: this.getLocationName(Number($event.value))
          });
        }
      }
    }
  }
  getLocationName(location_id) {
    const findex = this.locations.findIndex(f => Number(f.location_id) === Number(location_id));
    if (findex !== -1) {
      return this.locations[findex].location_hierarchy;
    }
  }
  getQuantityBasedOnLocation2(val, array: any[]) {
    if (this.editBranchtransfer) {
      const sindex = array.findIndex(f => Number(f.item_code) === Number(val.item_code));
      if (sindex !== -1) {
        const lindex = array[sindex].item_location.findIndex(f => Number(f.location_id) === Number(val.location));
        if (lindex !== -1) {
          this.qty2 = Number(array[sindex].item_location[lindex].item_qty);
        }
      }
    }
  }
  additemss() {
    if (this.createRequistionForm.valid) {
      console.log(this.createRequistionForm.value);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
    }
  }
  // Add item list function
  editItem(val) {
    this.createNewFlag = true;
    this.deleteFlag = false;
    this.service.filterItemsFromMaster(
      {
        "filters": [
          {
            "filter_type": "item_code",
            "filter_value": Number(val.inv_item_details[0].item_code),
            "type": "text"
          }
        ],
        page_index: 0,
        page_size: ''
      }
    ).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.locations = result.data[0].locs
      }
    });
    this.finalRequistionArray = val.inv_item_details;
    this.editBranchtransfer = true;
    this.finalRequistionForm.patchValue({
      'intended_use': val.branch_details.branch_id
    });
    this.bt_id = val.inv_bt_id;
  }
  addList() {
    if (this.createRequistionForm.valid && this.locations.length > 0 && (Number(this.createRequistionForm.value.item_quantity) <= Number(this.qty))
      && (Number(this.createRequistionForm.value.item_quantity) !== 0)) {
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createRequistionForm.value.item_code)
        && Number(f.location) === Number(this.createRequistionForm.value.location));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createRequistionForm.value.item_code,
          location: this.createRequistionForm.value.location
        });
        this.finalRequistionArray.push(this.createRequistionForm.value);
      }
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields or make sure item has a location or quantity do not exceed or is not zero', 'error');
    }
  }

  // Edit item list function

  editList(value) {
    this.createRequistionForm.reset();
    this.UpdateFlag = true;
    this.update_id = value;
    this.getItems2(this.finalRequistionArray[value])
  }

  // update item list function

  updateList() {
    if ((Number(this.createRequistionForm.value.item_quantity) <= Number(this.qty2))
      && ((Number(this.createRequistionForm.value.item_quantity) !== 0))
      && this.createRequistionForm.valid) {
      this.UpdateFlag = false;
      this.finalRequistionArray[this.update_id] = this.createRequistionForm.value;
      this.createRequistionForm.reset();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields or make sure item has a location or quantity do not exceed or is not zero', 'error');
    }
  }

  // delete item list function

  deleteList(value) {
    this.finalRequistionArray.splice(value, 1);
  }

  resetForm() {
    this.createRequistionForm.reset();
    this.finalRequistionForm.reset();
  }
  finalCancel() {
    this.finalRequistionArray = [];
    this.resetForm();
    this.editBranchtransfer = false;
    this.UpdateFlag = false;
  }
  //  Open Final Submit Modal function
  openMessageModal() {
    this.submitParam.text = 'Add';
    this.messageModal.openModal(this.submitParam);
  }
  //  Open Final Submit Modal function
  openSubmitModal() {
    if (this.finalRequistionForm.valid) {
      if (!this.editBranchtransfer) {
        this.submitParam.text = 'to create request ';
      } else {
        this.submitParam.text = 'to update ';
      }
      this.deleteModal.openModal(this.submitParam);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  openDeleteDialog(data) {
    this.bt_id = data.inv_bt_id;
    this.deleteFlag = true;
    this.deleteModal.openModal({ data: data });
  }
  fetchData(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBranchTransferData();
    return event;
  }
  finalSubmit($event) {
    if ($event) {
      if (!this.editBranchtransfer && !this.deleteFlag && !this.genFlag) {
        const JSON = {
          inv_bt_id: '',
          created_by: {
            id: this.currentUser.login_id,
            name: this.currentUser.full_name
          },
          updated_by: {
            id: this.currentUser.login_id,
            name: this.currentUser.full_name
          },
          created_date: '',
          updated_date: '',
          inv_item_details: this.finalRequistionArray,
          branch_details: {
            branch_id: this.finalRequistionForm.value.intended_use,
            branch_name: this.getBranchName(this.finalRequistionForm.value.intended_use),
            branch_prefix: this.getBranchPrefix(this.finalRequistionForm.value.intended_use),
          },
          status: 'active',
          type: 'branch-transfer',
          branch_to: this.getBranchPrefix(this.finalRequistionForm.value.intended_use),
          branch_from: '',
        };
        this.service.createBranchTransfer(JSON).subscribe((res: any) => {
          if (res) {
            this.finalRequistionArray = [];
            this.createRequistionForm.reset();
            this.finalRequistionForm.reset();
            this.commonService.showSuccessErrorMessage('Request Created Successfully', 'success');
            this.goBack();
          } else {
            this.commonService.showSuccessErrorMessage('Request Not Created Successfully', 'error');
          }
        });
      } else if (this.editBranchtransfer && !this.deleteFlag && !this.genFlag) {
        const JSON = {
          inv_bt_id: this.bt_id,
          inv_item_details: this.finalRequistionArray,
          updated_date: '',
          updated_by: {
            id: this.currentUser.login_id,
            name: this.currentUser.full_name
          }
        };
        this.service.updateBranchTransfer(JSON).subscribe((res: any) => {
          if (res) {
            this.finalRequistionArray = [];
            this.createRequistionForm.reset();
            this.finalRequistionForm.reset();
            this.editBranchtransfer = false;
            this.commonService.showSuccessErrorMessage('Request Updated Successfully', 'success');
            this.goBack();
          } else {
            this.commonService.showSuccessErrorMessage('Request not Updated Successfully', 'error');
          }
        });
      } else if (this.deleteFlag && !this.editBranchtransfer && !this.genFlag) {
        const JSON = {
          inv_bt_id: this.bt_id,
          updated_date: '',
          updated_by: {
            id: this.currentUser.login_id,
            name: this.currentUser.full_name
          },
          status: 'deleted'
        };
        this.service.updateBranchTransfer(JSON).subscribe((res: any) => {
          if (res) {
            this.finalRequistionArray = [];
            this.createRequistionForm.reset();
            this.finalRequistionForm.reset();
            this.editBranchtransfer = false;
            this.commonService.showSuccessErrorMessage('Request Deleted Successfully', 'success');
            this.goBack();
          } else {
            this.commonService.showSuccessErrorMessage('Request not Deleted Successfully', 'error');
          }
        });
      } else if (this.genFlag && !this.editBranchtransfer) {
        const JSON = {
          inv_bt_id: this.bt_id,
          updated_date: '',
          updated_by: {
            id: this.currentUser.login_id,
            name: this.currentUser.full_name
          },
          status: 'gatepass-created'
        };
        this.service.updateBranchTransfer(JSON).subscribe((res: any) => {
          if (res) {
            this.finalRequistionArray = [];
            this.createRequistionForm.reset();
            this.finalRequistionForm.reset();
            this.editBranchtransfer = false;
            this.commonService.showSuccessErrorMessage('Gate Pass Created Successfully', 'success');
            const JSON = {
              inv_bt_id: '',
              created_by: {
                id: this.currentUser.login_id,
                name: this.currentUser.full_name
              },
              updated_by: {
                id: this.currentUser.login_id,
                name: this.currentUser.full_name
              },
              created_date: '',
              updated_date: '',
              inv_item_details: this.item_det.inv_item_details,
              branch_details: {
                branch_id: '',
                branch_name: this.schoolInfo.school_name,
                branch_prefix: this.schoolInfo.school_prefix,
              },
              status: 'active',
              type: 'procurement-master',
              branch_from: this.item_det.branch_to,
              branch_to: '',
            };
            this.service.branchInsert(JSON).subscribe((res: any) => {
              if (res) {
                this.service.updateMultiple({
                  inv_item_details: this.item_det.inv_item_details
                }).subscribe((res: any) => {
                  if (res) {
                  }
                });
              }
            });
            this.goBack();
          } else {
            this.commonService.showSuccessErrorMessage('Error to create gate pass Successfully', 'error');
          }
        });
      }

    }
  }
  getBranchName(id) {
    const findex = this.branchArray.findIndex(f => Number(f.br_id) === Number(id));
    if (findex !== -1) {
      return this.branchArray[findex].br_name;
    }
  }
  getBranchPrefix(id) {
    const findex = this.branchArray.findIndex(f => Number(f.br_id) === Number(id));
    if (findex !== -1) {
      return this.branchArray[findex].br_prefix;
    }
  }
  generatePass(val) {
    this.genFlag = true;
    this.item_det = val;
    this.bt_id = val.inv_bt_id;
    this.submitParam.text = 'to create gate pass ';
    this.deleteModal.openModal(this.submitParam);
  }
  getBranchTransferData() {
    this.service.getBranchTransfer({
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "type": 'branch-transfer'
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        let ind = 0;
        for (const item of res.data) {
          this.BRANCH_TRANSFER_DATA.push({
            srno: ind + 1,
            date: item.created_date,
            created_by: item.created_by.name,
            branch_name: item.branch_details.branch_name,
            action: item,
          })
          ind++;
        }
        this.totalRecords = Number(res.totalRecords);
        localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
        this.datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
        this.datasource.paginator.length = this.paginator.length = this.totalRecords;
        this.datasource.paginator = this.paginator;
      }
    });
  }
  cancelDel($event) {
    this.deleteModal.closeDialog();
    this.deleteFlag = false;
  }

}
