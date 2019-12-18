import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErpCommonService } from 'src/app/_services';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css']
})
export class CreatePurchaseOrderComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('messageModal') messageModal;
  UpdateFlag = false;
  submitParam: any = {};
  createOrderForm: FormGroup;
  finalOrderForm: FormGroup;
  requistionArray: any[] = [];
  setBlankArray: any[] = [];
  finalSubmitArray: any = {};
  finalPoArray: any[] = [];
  itemArray: any[] = [];
  vendorArray: any[] = [];
  itemCode: any;
  vendorCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any[] = [];
  toBePromotedList: any[] = [];
  tableDivFlag = false;
  tabledataFlag = false;
  update_id: any;
  currentUser: any;
  session: any;
  ven_id: any;
  pm_type: any;
  pm_id: any;
  created_date: any;
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private erpCommonService: ErpCommonService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }
  ngOnInit() {
    this.buildForm();
    if (this.inventory.getrequisitionArray()) {
      this.requistionArray = this.inventory.getrequisitionArray();
      for (let item of this.requistionArray) {
        this.ven_id = item.pm_vendor ? item.pm_vendor.ven_id : '';
        this.pm_type = item.pm_type;
        this.pm_id = item.pm_id;
        for (let dety of item.pm_item_details) {
          if (dety.item_status === 'approved') {
            dety.item_status = 'pending';
            const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
            if (sindex !== -1) {
              this.finalRequistionArray[sindex].item_quantity = Number(this.finalRequistionArray[sindex].item_quantity) + Number(dety.item_quantity);
            } else {
              this.itemCodeArray.push({
                item_code: dety.item_code,
              });
              this.finalRequistionArray.push(dety);
            }
          }
        }
      }
    }

    this.finalOrderForm.patchValue({
      ven_id: this.ven_id,
    });
    this.vendor(this.ven_id);
  }
  buildForm() {
    this.createOrderForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: '',
      item_status: ''
    });
    this.finalOrderForm = this.fbuild.group({
      ven_id: '',
      ven_name: '',
      ven_address: '',
      ven_authorised_person_detail_contact: '',
      ven_authorised_person_detail_name: '',
      ven_contact: '',
      ven_email: '',
      ven_gst_no: '',
      ven_pan_no: ''
    });

  }
  filterItem($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        this.itemArray = [];
        this.commonService.getItemsFromMaster({ item_name: $event.target.value }).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.itemArray = result.data;
          }
        });
      }
    }
  }
  getItemPerId(item: any) {
    this.itemCode = item.item_code;
    this.createOrderForm.patchValue({
      item_name: item.item_name,
      item_desc: item.item_desc,
      item_units: item.item_units.name
    });
  }
  // Add item list function

  addList() {
    if (this.createOrderForm.valid) {
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createOrderForm.value.item_code));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createOrderForm.value.item_code,
        });
        this.createOrderForm.value.item_status = 'pending';
        this.finalRequistionArray.push(this.createOrderForm.value);
      }
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

  // Add item list function

  editList(value) {
    this.UpdateFlag = true;
    this.update_id = value;
    this.createOrderForm.patchValue({
      'item_code': this.finalRequistionArray[value].item_code,
      'item_name': this.finalRequistionArray[value].item_name,
      'item_desc': this.finalRequistionArray[value].item_desc,
      'item_quantity': this.finalRequistionArray[value].item_quantity,
      'item_units': this.finalRequistionArray[value].item_units,
      'item_price': this.finalRequistionArray[value].item_price
    });
  }

  // update item list function

  updateList() {
    if (this.createOrderForm.valid) {
      this.UpdateFlag = false;
      this.finalRequistionArray[this.update_id] = this.createOrderForm.value;
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
    this.createOrderForm.patchValue({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: ''
    });
  }
  resetVendor() {
    this.finalOrderForm.patchValue({
      ven_name: '',
      ven_address: '',
      ven_authorised_person_detail_contact: '',
      ven_authorised_person_detail_name: '',
      ven_contact: '',
      ven_email: '',
      ven_gst_no: '',
      ven_pan_no: ''
    });
  }
  finalCancel() {
    this.finalRequistionArray = [];
    this.resetForm();
    if (this.requistionArray.length > 0) {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.router.navigate(['../procurement-master'], { relativeTo: this.route });
    } else {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.commonService.tabChange.next({ 'currrentTab': 1 });
      this.router.navigate(['../procurement-master'], { relativeTo: this.route });
    }

  }
  //  Open Final Submit Modal function
  openMessageModal() {
    this.submitParam.text = 'Add';
    this.messageModal.openModal(this.submitParam);
  }
  //  Open Final Submit Modal function
  openSubmitModal() {
    if (this.finalOrderForm.valid) {
      this.submitParam.text = 'Create Purchase Order';
      this.deleteModal.openModal(this.submitParam);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  filterVendor($event) {
    // keyCode
    this.resetVendor();
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '') {
        this.vendorArray = [];
        this.erpCommonService.getVendor({ ven_id: Number($event.target.value) }).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            let vendorDetail: any;
            vendorDetail = res.data[0];
            this.finalOrderForm.patchValue({
              ven_name: vendorDetail.ven_name,
              ven_address: vendorDetail.ven_address,
              ven_authorised_person_detail_contact: vendorDetail.ven_authorised_person_detail_contact,
              ven_authorised_person_detail_name: vendorDetail.ven_authorised_person_detail_name,
              ven_contact: vendorDetail.ven_contact,
              ven_email: vendorDetail.ven_email,
              ven_gst_no: vendorDetail.ven_gst_no,
              ven_pan_no: vendorDetail.ven_pan_no
            })
          }
        });
      }
    }
  }

  vendor(ven_id) {
    // keyCode
    this.resetVendor();
    if (ven_id !== '') {
      this.vendorArray = [];
      this.erpCommonService.getVendor({ ven_id: Number(ven_id) }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          let vendorDetail: any;
          vendorDetail = res.data[0];
          this.finalOrderForm.patchValue({
            ven_name: vendorDetail.ven_name,
            ven_address: vendorDetail.ven_address,
            ven_authorised_person_detail_contact: vendorDetail.ven_authorised_person_detail_contact,
            ven_authorised_person_detail_name: vendorDetail.ven_authorised_person_detail_name,
            ven_contact: vendorDetail.ven_contact,
            ven_email: vendorDetail.ven_email,
            ven_gst_no: vendorDetail.ven_gst_no,
            ven_pan_no: vendorDetail.ven_pan_no
          })
        }
      });
    }

  }

  finalSubmit($event) {
    if ($event) {
      for (let item of this.requistionArray) {
        for (let dety of item.pm_item_details) {
          const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
          if (sindex !== -1) {
            dety.item_status = 'approved';
          }
        }
      };
      this.finalSubmitArray['pm_item_details'] = this.finalRequistionArray;
      this.finalSubmitArray['pm_intended_use'] = '';
      this.finalSubmitArray['pm_source'] = 'PO';
      this.finalSubmitArray['pm_type'] = 'PO';
      if (this.pm_type === 'PR') {
        this.finalSubmitArray['pm_created'] = {
          created_by: Number(this.currentUser.login_id),
          created_by_name: this.currentUser.full_name,
          created_date: ''
        }
        this.finalSubmitArray['pm_approved'] = {
          approved_by: '',
          approved_by_name: '',
          approved_date: ''
        }
      }
      this.finalSubmitArray['pm_updated'] = {
        updated_by: Number(this.currentUser.login_id),
        updated_by_name: this.currentUser.full_name,
        update_date: ''
      }
      this.finalSubmitArray['pm_vendor'] = {
        ven_id: Number(this.finalOrderForm.value.ven_id),
        ven_name: this.finalOrderForm.value.ven_name
      }
      this.finalSubmitArray['pm_status'] = 'pending';
      this.finalSubmitArray['pm_session'] = this.session.ses_id;
      if (this.pm_type === 'PO') {
        this.finalSubmitArray['pm_id'] = this.pm_id;
        this.finalPoArray.push(this.finalSubmitArray);
        this.inventory.updateRequistionMaster(this.finalPoArray).subscribe((result: any) => {
          if (result) {
            this.commonService.showSuccessErrorMessage('Purchase Order Updated Successfylly', 'success');
            this.finalSubmitArray = [];
            this.finalRequistionArray = [];
            this.itemCodeArray = [];
            this.requistionArray = [];
            this.finalPoArray = [];
          }
        });
      } else {
        this.commonService.insertRequistionMaster(this.finalSubmitArray).subscribe((result: any) => {
          if (result) {
            this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
              if (result) {
                this.commonService.showSuccessErrorMessage('Purchase Order Generated Successfylly', 'success');
                this.finalSubmitArray = [];
                this.finalRequistionArray = [];
                this.itemCodeArray = [];
                this.requistionArray = [];
              }
            });
          } else {
            this.commonService.showSuccessErrorMessage('Error While Generating Order', 'error');
          }
        });
      }
    }
  }
}