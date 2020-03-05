import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService, SisService } from '../../_services/index';
import { saveAs } from 'file-saver';
import { NumberToWordPipe } from '../../_pipes/index';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenerateBillComponent implements OnInit {
  searchForm: FormGroup;
  itemSearchForm: FormGroup;
  userData: any = '';
  itemData: any = [];
  itemLogData: any = [];
  currentUser: any;
  showReturnIssueSection = false;
  itemArray: any = [];
  tableArray: any = [];
  schoolInfo: any;
  formGroupArray: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialog: MatDialog,
    public inventory: InventoryService,
    public sisService: SisService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.buildForm();
    this.getSchool();
  }
  buildForm() {
    this.searchForm = this.fbuild.group({
      searchId: '',
      user_role_id: ''
    });
    this.itemSearchForm = this.fbuild.group({
      scanItemId: '',
      due_date: '',
      issue_date: '',
      return_date: ''
    });
    this.formGroupArray = [];
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
  searchUser() {
    if (this.searchForm && this.searchForm.value.searchId) {
      const au_role_id = this.searchForm.value.user_role_id;
      const au_admission_no = this.searchForm.value.searchId;
      if (au_role_id === '4') {
        this.erpCommonService.getStudentInformation({ 'admission_no': au_admission_no, 'au_role_id': au_role_id }).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            this.userData = result.data ? result.data[0] : '';
            this.itemData = [];
            this.itemLogData = [];
          } else {
            this.userData = [];
            this.itemData = [];
            this.itemLogData = [];
          }
        });
      } else if (au_role_id === '3') {
        this.erpCommonService.getEmployeeDetail({ 'emp_id': Number(this.searchForm.value.searchId), emp_login_id: { $ne: '' } }).subscribe((result: any) => {
          if (result) {
            var resultJson = {
              emp_id: result.emp_id,
              au_login_id: result.emp_login_id,
              au_role_id: 3,
              au_full_name: result.emp_name,
              au_mobile: result.emp_personal_detail && result.emp_personal_detail.contact_detail ? result.emp_personal_detail.contact_detail.primary_mobile_no : ''
            }
            console.log('resultJson--', resultJson);
            this.userData = resultJson;
            this.itemData = [];
            this.itemLogData = [];
          } else {
            this.userData = [];
            this.itemData = [];
            this.itemLogData = [];
          }
        });
      }
    }
  }
  resetAll() {
    this.itemData = [];
    this.itemLogData = [];
    // this.issueItemData = [];
    // this.finIssueItem = [];
    // this.userData = [];
    // this.formGroupArray = [];
    // this.searchForm.controls['searchId'].setValue('');
    // this.returnIssueItemsForm.reset();
    // this.ITEM_LOG_LIST_ELEMENT = [];
    // this.itemLoglistdataSource = new MatTableDataSource<ItemLogListElement>(this.ITEM_LOG_LIST_ELEMENT);
  }

  setTotal(item, i) {
    if (this.formGroupArray[i].formGroup.value.item_quantity > this.tableArray[i]['available_item']) {
      this.common.showSuccessErrorMessage('Item available in shop is ' + this.tableArray[i]['available_item'], 'error');
      this.formGroupArray[i].formGroup.patchValue({
        'item_quantity': ''
      })
    } else {
      this.tableArray[i]['total_price'] = Number(this.formGroupArray[i].formGroup.value.item_quantity) * this.tableArray[i]['item_selling_price'];
      this.formGroupArray[i].formGroup.value.total_price = this.tableArray[i]['total_price'];
    }
  }

  searchItemData() {
    const findex = this.itemArray.findIndex(f => Number(f.item_code) === Number(this.itemSearchForm.value.scanItemId));
    if (findex !== -1) {
      this.common.showSuccessErrorMessage('Item Already exist in the cart', 'error');
    } else {
      let inputJson: any = {};
      inputJson = {
        emp_id: Number(this.currentUser.login_id),
        item_code: Number(this.itemSearchForm.value.scanItemId)
      }
      this.inventory.getStoreIncharge(inputJson).subscribe((result: any) => {
        if (result.length > 0) {
          this.tableArray = [];
          this.formGroupArray = [];
          this.itemArray.push(result[0].item_assign[0]);
          for (let item of this.itemArray) {
            this.tableArray.push({
              item_code: item.item_code,
              item_name: item.item_name,
              item_selling_price: item.item_selling_price,
              available_item: item.item_quantity,
              item_quantity: '',
              total_price: '',
            });
            this.formGroupArray.push({
              formGroup: this.fbuild.group({
                item_code: item.item_code,
                item_name: item.item_name,
                item_selling_price: item.item_selling_price,
                item_quantity: '',
                total_price: '',
              })
            });
          }
        } else {
          this.common.showSuccessErrorMessage('Item is not available at store', 'error');
        }
      })
    }
  }
  saveItem() {
    let grandTotal = 0;
    var filterJson: any = {};
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    for (let item of itemAssign) {
      grandTotal = Number(grandTotal) + Number(item.total_price);
    }
    finalJson = {
      buyer_details: this.userData,
      bill_details: itemAssign,
      bill_total: grandTotal
    }
    filterJson = {
      emp_id: Number(this.currentUser.login_id),
      item_details: itemAssign,
    }

    this.inventory.insertStoreBill(finalJson).subscribe((result: any) => {
      if (result) {
        let billArray: any = {};
        billArray['bill_id'] = result.bill_id;
        billArray['bill_date'] = this.common.dateConvertion(result.created_date, 'dd-MMM-y');
        billArray['bill_total'] = result.bill_total;
        billArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(result.bill_total));
        billArray['bill_created_by'] = this.currentUser.full_name;
        billArray['bill_details'] = result.bill_details;
        billArray['school_name'] = this.schoolInfo.school_name;
        billArray['school_logo'] = this.schoolInfo.school_logo;
        billArray['school_address'] = this.schoolInfo.school_address;
        billArray['name'] = result.buyer_details.au_full_name;
        billArray['mobile'] = result.buyer_details.au_mobile;
        if (result.buyer_details.au_role_id === 3) {
          billArray['adm_no'] = result.buyer_details.emp_id;
          billArray['class_name'] = '';
        } else {
          billArray['adm_no'] = result.buyer_details.em_admission_no;
          billArray['class_name'] = result.buyer_details.sec_name ? result.buyer_details.class_name + '-' + result.buyer_details.sec_name : '';
        }
        this.inventory.generateStoreBill(billArray).subscribe((result: any) => {
          if (result && result.status == 'ok') {
            const length = result.data.fileUrl.split('/').length;
            saveAs(result.data.fileUrl, result.data.fileUrl.split('/')[length - 1]);
            this.inventory.updateStoreItem(filterJson).subscribe((result: any) => {
              if (result) {
                this.common.showSuccessErrorMessage(result.message, 'success');
              }
            });
          }
        })
        this.resetItem();
      }
    });
  }
  resetItem() {
    this.itemArray = [];
    this.tableArray = [];
    this.formGroupArray = [];
    this.itemSearchForm.reset();
    this.itemSearchForm.controls['scanItemId'].setValue('');

  }
}
