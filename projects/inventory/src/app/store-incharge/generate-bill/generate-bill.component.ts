import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from '../../_services/index';

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
  formGroupArray: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialog: MatDialog,
    public inventory: InventoryService,
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.buildForm();
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
    this.tableArray[i]['total_price'] = Number(this.formGroupArray[i].formGroup.value.no_of_item) * this.tableArray[i]['item_selling_price'];
    this.formGroupArray[i].formGroup.value.total_price = this.tableArray[i]['total_price'];
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
              no_of_item: '',
              total_price: '',
            });
            this.formGroupArray.push({
              formGroup: this.fbuild.group({
                item_code: item.item_code,
                item_name: item.item_name,
                item_selling_price: item.item_selling_price,
                no_of_item: '',
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
    console.log(this.formGroupArray);
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    finalJson = {
      buyer_id: this.userData.emp_id,
      buyer_name: this.userData.au_full_name,
      item_assign: itemAssign
    }
    console.log('finalJson', finalJson);
  }
  resetItem() {
    this.itemArray = [];
    this.tableArray = [];
    this.formGroupArray = [];
    this.itemSearchForm.reset();
    this.itemSearchForm.controls['scanItemId'].setValue('');

  }
}
