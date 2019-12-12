import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAPIService, SisService, AxiomService } from '../../_services';

@Component({
  selector: 'app-procurement-master',
  templateUrl: './procurement-master.component.html',
  styleUrls: ['./procurement-master.component.css']
})
export class ProcurementMasterComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('messageModal') messageModal;
  submitParam: any = {};
  createRequistionForm: FormGroup;
  finalRequistionForm: FormGroup;
  itemArray: any[] = [];
  itemCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any[] = [];
  finalSubmitArray: any = {};
  UpdateFlag = false;
  update_id: any;
  currentUser: any;
  session: any;
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.createRequistionForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_status: ''

    });
    this.finalRequistionForm = this.fbuild.group({
      intended_use: '',
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

  addList() {
    if (this.createRequistionForm.valid) {
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createRequistionForm.value.item_code));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createRequistionForm.value.item_code,
        });
        this.createRequistionForm.value.item_status = '0';
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
    this.createRequistionForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: ''
    });
  }
  finalCancel() {
    this.finalRequistionArray = [];
    this.resetForm();
  }
  //  Open Final Submit Modal function
  openMessageModal() {
    this.submitParam.text = 'Add';
    this.messageModal.openModal(this.submitParam);
  }
  //  Open Final Submit Modal function
  openSubmitModal() {
    if (this.finalRequistionForm.valid) {
      this.submitParam.text = 'Create Requisition Request';
      this.deleteModal.openModal(this.submitParam);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  finalSubmit($event) {
    if ($event) {
      this.finalSubmitArray['rm_item_details'] = this.finalRequistionArray;
      this.finalSubmitArray['rm_intended_use'] = this.finalRequistionForm.value.intended_use;
      this.finalSubmitArray['rm_source'] = 'PR';
      this.finalSubmitArray['rm_type'] = 'PR';
      this.finalSubmitArray['rm_created'] = {
        created_by: Number(this.currentUser.login_id),
        created_date: ''
      }
      this.finalSubmitArray['rm_updated'] = {
        updated_by: Number(this.currentUser.login_id),
        update_date: ''
      }
      this.finalSubmitArray['rm_approved'] = {
        approved_by: '',
        approved_date: ''
      }
      this.finalSubmitArray['rm_status'] = '0';
      this.finalSubmitArray['rm_session'] = this.session.ses_id;
      this.commonService.insertRequistionMaster(this.finalSubmitArray).subscribe((result: any) => {
        if (result) {
          this.commonService.showSuccessErrorMessage('Requistion Request Generated Successfylly', 'success');
          this.finalSubmitArray = [];
          this.finalRequistionArray = [];
          this.itemCodeArray = [];
        } else {
          this.commonService.showSuccessErrorMessage('Error While Generating Request', 'error');
        }
      });
    }
  }
}