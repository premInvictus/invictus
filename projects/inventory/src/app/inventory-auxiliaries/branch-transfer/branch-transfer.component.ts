import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
@Component({
  selector: 'app-branch-transfer',
  templateUrl: './branch-transfer.component.html',
  styleUrls: ['./branch-transfer.component.css']
})
export class BranchTransferComponent implements OnInit {
  createNewFlag = false;
  bt_id: any;
  constructor(private service: InventoryService,
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
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
  BRANCH_TRANSFER_DATA: any[] = [];
  datasource = new MatTableDataSource<any>(this.BRANCH_TRANSFER_DATA);
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getBranch();
    this.getBranchTransferData();
    this.buildForm();
  }
  buildForm() {
    this.createRequistionForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: '',
      item_status: ''

    });
    this.finalRequistionForm = this.fbuild.group({
      intended_use: '',
    });

  }
  createNewBranchTransfer() {
    this.createNewFlag = true;
    this.finalRequistionArray = [];
    this.itemArray = [];
    this.itemCodeArray = [];
    this.deleteFlag = false;
    this.finalRequistionForm.reset();
    this.createRequistionForm.reset();
    this.editBranchtransfer = false;
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
  getItemPerId(item: any) {
    this.itemCode = item.item_code;
    this.createRequistionForm.patchValue({
      item_name: item.item_name,
      item_desc: item.item_desc,
      item_units: item.item_units.name
    });
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
    this.finalRequistionArray = val.inv_item_details;
    this.editBranchtransfer = true;
    this.finalRequistionForm.patchValue({
      'intended_use': val.branch_details.branch_id
    });
    this.bt_id = val.inv_bt_id;
  }
  addList() {
    if (this.createRequistionForm.valid) {
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createRequistionForm.value.item_code));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createRequistionForm.value.item_code,
        });
        this.createRequistionForm.value.item_status = 'pending';
        this.finalRequistionArray.push(this.createRequistionForm.value);
      }
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

  // Edit item list function

  editList(value) {
    this.UpdateFlag = true;
    this.update_id = value;
    this.createRequistionForm.patchValue({
      'item_code': this.finalRequistionArray[value].item_code,
      'item_name': this.finalRequistionArray[value].item_name,
      'item_desc': this.finalRequistionArray[value].item_desc,
      'item_quantity': this.finalRequistionArray[value].item_quantity,
      'item_units': this.finalRequistionArray[value].item_units
    });
  }

  // update item list function

  updateList() {
    if (this.createRequistionForm.valid) {
      this.UpdateFlag = false;
      this.finalRequistionArray[this.update_id] = this.createRequistionForm.value;
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
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
      if (!this.editBranchtransfer && !this.deleteFlag) {
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
            branch_name: this.getBranchName(this.finalRequistionForm.value.intended_use)
          },
          status: 'active',
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
      } else if (this.editBranchtransfer && !this.deleteFlag) {
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
      } else if (this.deleteFlag && !this.editBranchtransfer) {
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
      }

    }
  }
  getBranchName(id) {
    const findex = this.branchArray.findIndex(f => Number(f.br_id) === Number(id));
    if (findex !== -1) {
      return this.branchArray[findex].br_name;
    }
  }
  getBranchTransferData() {
    this.service.getBranchTransfer({
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize
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
