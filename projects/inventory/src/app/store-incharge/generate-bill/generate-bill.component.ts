import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService, SisService } from '../../_services/index';
import { saveAs } from 'file-saver';
import { NumberToWordPipe, IndianCurrency } from 'src/app/_pipes/index';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {SelectionModel} from '@angular/cdk/collections';
import { SearchViaNameComponent } from '../../inventory-shared/search-via-name/search-via-name.component';


@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenerateBillComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  searchForm: FormGroup;
  payForm: FormGroup;
  itemSearchForm: FormGroup;
  userData: any = '';
  itemData: any = [];
  itemLogData: any = [];
  currentUser: any;
  showReturnIssueSection = false;
  previewTableFlag = false;
  itemArray: any = [];
  tableArray: any = [];
  schoolInfo: any;
  formGroupArray: any[] = [];
  tableReciptArray: any[] = [];
  tableHeader: any;
  payModes:any[]=['cash','wallet'];
  wallet_details:any={
    balancetotal: 0,
    balancetype:'',
    submitflag:false,
    min_wallet_balance:0
  };
  storeinchargeDetails:any;
  storeinchargeLocation:any;
  locationArray: any[] = [];
  locationId: any;
  bundleArray: any[] = [];
  requiredArray: any[] = [];
  studentArrayByName:any[] = [];
  constructor(
    private fbuild: FormBuilder,
    private common: CommonAPIService,
    private erpCommonService: ErpCommonService,
    public dialog: MatDialog,
    public inventory: InventoryService,
    public sisService: SisService,
    public sanatizer: DomSanitizer
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.buildForm();
    this.getSchool();
    this.formGroupArray = [];
    this.getGlobalSettingReplace();
    this.getBundle();
  }
  buildForm() {
    this.searchForm = this.fbuild.group({
      searchId: '',
      user_role_id: '',
      location_id:'',
      param_location_id:''
    });
    this.itemSearchForm = this.fbuild.group({
      scanItemId: '',
      due_date: '',
      issue_date: '',
      return_date: '',
      bundle_id:''
    });
    this.formGroupArray = [];
    this.payForm = this.fbuild.group({
      pay_id:''
    })
  }
  searchLocationByName($event) {
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        const inputJson = {
          "filter": $event.target.value,
        };
        this.locationArray = [];
        this.inventory.getParentLocationOnly(inputJson).subscribe((result: any) => {
          if (result) {
            this.locationArray = result;
          }
        });
      }
    }
  }
  getBundle(){
    this.bundleArray = [];
    const param:any = {};
    param.emp_id =  Number(this.currentUser.login_id),
    this.inventory.getAllBundle(param).subscribe((result:any) => {
      if(result && result.length > 0) {
        this.bundleArray = result;
        this.storeinchargeLocation = this.bundleArray[0].item_location
        console.log('this.bundleArray',this.bundleArray);
      }
    })
  }
  getLocationId(item: any) {
    this.locationId = item.location_id;
    this.searchForm.patchValue({
      location_id: item.location_name,
      param_location_id:item.location_id
    });
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
      this.resetItem();
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
            this.common.showSuccessErrorMessage('Student not found', 'error');
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
            //console.log('resultJson--', resultJson);
            this.userData = resultJson;
            this.itemData = [];
            this.itemLogData = [];
          } else {
            this.userData = [];
            this.itemData = [];
            this.itemLogData = [];
            this.common.showSuccessErrorMessage('Employee not found', 'error');
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
      this.formGroupArray[i].formGroup.patchValue({
        total_price: this.tableArray[i]['total_price']
      })
      // this.formGroupArray[i].formGroup.value.total_price = this.tableArray[i]['total_price'];
    }
  }
  addBundleItems(){
    const bundleDetails = this.bundleArray.find(e => e.bundle_id == this.itemSearchForm.value.bundle_id);
    if(bundleDetails){
      console.log(bundleDetails);
      bundleDetails.item_assign.forEach(element => {
        const findex = this.itemArray.findIndex(f => Number(f.item_code) === Number(element.selling_item.item_code));
        if (findex == -1) {
          this.itemArray.push(element.selling_item);
          this.selection.toggle(element.item_code);
          if(element.item_optional != '1') {
            this.requiredArray.push(element.item_code);
          }
        }
      });
      this.pushItem();
    }
  }
  pushItem() {
    this.tableArray = [];
    for (let item of this.itemArray) {
      const bundleDetails = this.bundleArray.find(e => e.bundle_id == this.itemSearchForm.value.bundle_id);
      const findex1 = bundleDetails.item_assign.findIndex(f => Number(f.item_code) === Number(item.item_code));
      let tempitem_quantity = 1;
      if (findex1 != -1) {
        tempitem_quantity = bundleDetails.item_assign[findex1].item_quantity ? bundleDetails.item_assign[findex1].item_quantity : 1;
      }
      this.tableArray.push({
        item_code: item.item_code,
        item_name: item.item_name,
        item_selling_price: item.item_selling_price,
        available_item: item.item_quantity,
        item_quantity: tempitem_quantity,
        total_price: '',
      });
      const findex = this.formGroupArray.findIndex(f => Number(f.formGroup.value.item_code) === Number(item.item_code));
      if (findex === -1) {
        this.formGroupArray.push({
          formGroup: this.fbuild.group({
            item_code: item.item_code,
            item_name: item.item_name,
            item_selling_price: item.item_selling_price,
            item_quantity: tempitem_quantity,
            total_price: '',
          })
        });
      }
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
          this.storeinchargeDetails = result[0];
          this.storeinchargeLocation = this.storeinchargeDetails.item_location;
          this.itemArray.push(result[0].item_assign[0]);
          this.selection.toggle(result[0].item_assign[0].item_code);
          this.pushItem();
        } else {
          this.common.showSuccessErrorMessage('Item is not available at store', 'error');
        }
      })
    }

  }
  getTotalPrice(index) {
    if (this.formGroupArray[index].formGroup.value.item_selling_price &&
      this.formGroupArray[index].formGroup.value.item_quantity) {
      return Number(this.formGroupArray[index].formGroup.value.item_selling_price
      ) * Number(this.formGroupArray[index].formGroup.value.item_quantity)
    } else {
      return '-';
    }
  }
  getTotalPriceSum(index) {
    let sum=0;
    for (let index = 0; index < this.tableArray.length; index++) {
      const element = this.tableArray[index];
      sum += Number(this.tableArray[index].item_selling_price) * Number(this.formGroupArray[index].formGroup.value.item_quantity)
    }
    return sum;
  }
  previewSaveItem() {
    this.tableReciptArray = [];
    let grandTotal = 0;
    var filterJson: any = {};
    var finalJson: any = {};
    const itemAssign: any[] = [];
    let updateFlag = false;
    let index = 0;
    console.log('this.selection.selected',this.selection.selected);
    for (let item of this.formGroupArray) {
      const findex = this.selection.selected.findIndex(e => e == item.formGroup.value.item_code);
      if(findex != -1) {
        console.log('item.formGroup.value',item.formGroup.value);
        if (this.formGroupArray[index].formGroup.valid) {
          if (item.formGroup.value.item_location !== '') {
            item.formGroup.patchValue({
              total_price: Number(item.formGroup.value.item_selling_price) * Number(item.formGroup.value.item_quantity)
            })
            itemAssign.push(item.formGroup.value);
            updateFlag = true;
          } else {
            updateFlag = false;
            break;
          }
        } else {
          updateFlag = false;
          break;
        }
      }
      index++;
    }
    if (updateFlag && itemAssign.length > 0) {
      var sc_school_logo = /si_school_logo/gi;
      var si_school_name = /si_school_name/gi;
      var si_school_address = /si_school_address/gi;
      var si_school_city = /si_school_city/gi;
      var si_school_state = /si_school_state/gi;
      var si_school_afflication_no = /si_school_afflication_no/gi;
      var si_school_phone_no = /si_school_phone_no/gi;
      var si_school_website = /si_school_website/gi;
      var invoice_no = /invoice_no/gi;
      var invoice_date = /invoice_date/gi;
      this.tableHeader = this.tableHeader.replace(sc_school_logo, this.schoolInfo.school_logo);
      this.tableHeader = this.tableHeader.replace(si_school_name, this.schoolInfo.school_name);
      this.tableHeader = this.tableHeader.replace(si_school_address, this.schoolInfo.school_address);
      this.tableHeader = this.tableHeader.replace(si_school_phone_no, this.schoolInfo.school_phone);
      this.tableHeader = this.tableHeader.replace(si_school_city, this.schoolInfo.school_city);
      this.tableHeader = this.tableHeader.replace(si_school_state, this.schoolInfo.school_state);
      this.tableHeader = this.tableHeader.replace(si_school_afflication_no, this.schoolInfo.school_afflication_no);
      this.tableHeader = this.tableHeader.replace(si_school_website, this.schoolInfo.school_website);
      // this.tableHeader = this.tableHeader.replace(invoice_no, this.schoolInfo.school_phone);
      // this.tableHeader = this.tableHeader.replace(invoice_date, this.schoolInfo.school_phone);

      this.previewTableFlag = true;
      let i = 0;
      console.log('at preview', itemAssign);
      for (let item of itemAssign) {
        grandTotal = Number(grandTotal) + Number(item.total_price);
        itemAssign[i].item_name = new TitleCasePipe().transform(item.item_name);
        // itemAssign[i].total_price = new IndianCurrency().transform(item.total_price);
        i++;
      }
      finalJson = {
        buyer_details: this.userData,
        bill_details: itemAssign,
        bill_total: grandTotal
      }
      this.tableReciptArray['bill_total'] = new IndianCurrency().transform(grandTotal);
      this.tableReciptArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(grandTotal));
      this.tableReciptArray['bill_created_by'] = this.currentUser.full_name;
      this.tableReciptArray['bill_details'] = itemAssign;
      this.tableReciptArray['school_name'] = this.schoolInfo.school_name;
      this.tableReciptArray['school_logo'] = this.schoolInfo.school_logo;
      this.tableReciptArray['school_address'] = this.schoolInfo.school_address;
      this.tableReciptArray['school_phone'] = this.schoolInfo.school_phone;
      this.tableReciptArray['school_city'] = this.schoolInfo.school_city;
      this.tableReciptArray['school_state'] = this.schoolInfo.school_state;
      this.tableReciptArray['school_afflication_no'] = this.schoolInfo.school_afflication_no;
      this.tableReciptArray['school_website'] = this.schoolInfo.school_website;
      this.tableReciptArray['name'] = this.userData.au_full_name;
      this.tableReciptArray['mobile'] = this.userData.active_contact;
      if (this.userData.au_role_id === 3) {
        this.tableReciptArray['adm_no'] = this.userData.emp_id;
        this.tableReciptArray['class_name'] = '';
        this.tableReciptArray['role_id'] = 'Employee Id';
      } else {
        this.tableReciptArray['adm_no'] = this.userData.em_admission_no;
        this.tableReciptArray['class_name'] = this.userData.sec_name ? this.userData.class_name + '-' + this.userData.sec_name : '';
        this.tableReciptArray['role_id'] = 'Admission No.';
      }
      // console.log(this.tableReciptArray, 'tableReciptArray');
    } else {
      this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  async getWallets() {
    this.wallet_details = {
      balancetotal: 0,
      balancetype:'',
      submitflag:false,
      min_wallet_balance:0
    };
    if(this.payForm.value.pay_id == 'wallet') {
      let finalJson = {
        "gs_alias": [
          "min_wallet_balance"
        ]
      };
      await this.inventory.getGlobalSettingReplace(finalJson).toPromise().then((result: any) => {
        if (result && result.status === 'ok') {
          if(result.data[0].gs_value) {
            this.wallet_details.min_wallet_balance = parseInt(result.data[0].gs_value);
  
          }
        }
      });
      this.inventory.getWallets({ login_id: this.userData.au_login_id }).toPromise().then((result: any) => {
        if (result && result.status === 'ok') {
          let total_credit = 0;
          let total_debit = 0;
          for (const item of result.data) {
            if(item.w_amount_type == 'credit'){
              total_credit += parseInt(item.w_amount);
            }
            if(item.w_amount_type == 'debit'){
              total_debit += parseInt(item.w_amount);
            }
          }
          this.wallet_details.balancetotal = total_credit - total_debit;
          if(this.wallet_details.balancetotal > 0) {
            this.wallet_details.balancetype = '+';
          } else if(this.wallet_details.balancetotal < 0) {
            this.wallet_details.balancetype = '';
          }
          let grandTotal= 0; 
          for (let item of this.formGroupArray) {
            if (item.formGroup.valid) {
              if (item.formGroup.value.item_location !== '') {
                grandTotal = Number(grandTotal) + Number(item.formGroup.value.total_price);
              }
            }
          }
          if((this.wallet_details.balancetotal-(this.wallet_details.min_wallet_balance)) >= grandTotal){
            this.wallet_details.submitflag = true;
          }
          console.log('this.wallet_details',this.wallet_details);
        } else {
          this.common.showSuccessErrorMessage(result.data, 'error');
        }
      });
    } else if(this.payForm.value.pay_id == 'cash') {
      this.wallet_details.submitflag = true;
    }
	}
  saveItem() {
    let grandTotal = 0;
    var filterJson: any = {};
    var finalJson: any = {};
    const itemAssign: any[] = [];
    let updateFlag = false;
    let index = 0;
    for (let item of this.formGroupArray) {
      const findex = this.selection.selected.findIndex(e => e == item.formGroup.value.item_code);
      if(findex != -1) {
        if (this.formGroupArray[index].formGroup.valid) {
          if (item.formGroup.value.item_location !== '') {
            itemAssign.push(item.formGroup.value);
            updateFlag = true;
          } else {
            updateFlag = false;
            break;
          }
        } else {
          updateFlag = false;
          break;
        }
      }
      index++;
    }
    if (updateFlag && itemAssign.length > 0) {
      for (let item of itemAssign) {
        grandTotal = Number(grandTotal) + Number(item.total_price);
      }
      finalJson = {
        buyer_details: this.userData,
        bill_details: itemAssign,
        bill_total: grandTotal,
        status:'approved',
        mop:this.payForm.value.pay_id,
        item_location:this.storeinchargeLocation
      }
      filterJson = {
        emp_id: Number(this.currentUser.login_id),
        item_details: itemAssign,
      }
      console.log('finalJson',finalJson);
      this.inventory.insertStoreBill(finalJson).subscribe((result: any) => {
        if (result) {
          let i = 0;
          for (let item of result.bill_details) {
            result.bill_details[i].item_name = new TitleCasePipe().transform(item.item_name);
            result.bill_details[i].total_price = new IndianCurrency().transform(item.total_price);
            i++;
          }
          let billArray: any = {};
          billArray['bill_id'] = result.bill_id;
          billArray['bill_date'] = this.common.dateConvertion(result.created_date, 'dd-MMM-y');
          billArray['bill_total'] = new IndianCurrency().transform(result.bill_total);
          billArray['bill_total_words'] = new TitleCasePipe().transform(new NumberToWordPipe().transform(result.bill_total));
          billArray['bill_created_by'] = this.currentUser.full_name;
          billArray['bill_details'] = result.bill_details;
          billArray['school_name'] = this.schoolInfo.school_name;
          billArray['school_logo'] = this.schoolInfo.school_logo;
          billArray['school_address'] = this.schoolInfo.school_address;
          billArray['school_phone'] = this.schoolInfo.school_phone;
          billArray['school_city'] = this.schoolInfo.school_city;
          billArray['school_state'] = this.schoolInfo.school_state;
          billArray['school_afflication_no'] = this.schoolInfo.school_afflication_no;
          billArray['school_website'] = this.schoolInfo.school_website;
          billArray['name'] = result.buyer_details.au_full_name;
          billArray['mobile'] = result.buyer_details.active_contact;
          billArray['active_parent'] = result.buyer_details.active_parent;
          if (result.buyer_details.au_role_id === 3) {
            billArray['adm_no'] = result.buyer_details.emp_id;
            billArray['class_name'] = '';
            billArray['role_id'] = 'Employee Id';
          } else {
            billArray['adm_no'] = result.buyer_details.em_admission_no;
            billArray['class_name'] = result.buyer_details.sec_name ? result.buyer_details.class_name + '-' + result.buyer_details.sec_name : '';
            billArray['role_id'] = 'Admission No.';
          }
          if(this.payForm.value.pay_id == 'wallet') {
            const inputJson:any={};
            // inputJson.ftr_ref_location_id = this.storeinchargeDetails.item_location;
            inputJson.ftr_ref_location_id = this.storeinchargeLocation;
            inputJson.ftr_ref_no_of_items=result.bill_details.length;
            inputJson.ftr_ref_id=result.bill_no;
            inputJson.ftr_transaction_date=this.common.dateConvertion(result.created_date, 'y-MM-dd');
            inputJson.ftr_amount=result.bill_total;
            inputJson.ftr_amount_type='debit';
            inputJson.login_id=this.userData.au_login_id;
            this.inventory.insertWallets(inputJson).subscribe((result:any)=>{
              if(result && result.status == 'ok'){
                this.common.showSuccessErrorMessage('Ordered placed successfully','success');
              } else {
                this.common.showSuccessErrorMessage(result.message,'error');
              }
            })
          } else {

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
          this.previewTableFlag = false;
        }
      });
    } else {
      this.common.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  checkRequired(item_code){
    const findex = this.requiredArray.findIndex(e => e == item_code);
    return findex == -1 ? false : true;
  }
  resetItem() {
    this.itemArray = [];
    this.tableArray = [];
    this.formGroupArray = [];
    this.itemSearchForm.reset();
    this.selection.clear();
    this.requiredArray = [];
    this.itemSearchForm.controls['scanItemId'].setValue('');

  }
  resetPrint() {
    this.previewTableFlag = false;
  }
  removeItem(i) {
    this.itemArray.splice(i, 1);
    this.tableArray.splice(i, 1);
    this.formGroupArray.splice(i, 1);
  }
  getGlobalSettingReplace() {
    let finalJson = {
      "gs_alias": [
        "store_receipt_header"
      ]
    };
    this.inventory.getGlobalSettingReplace(finalJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.tableHeader = result.data[0].gs_value;
        //console.log(this.tableHeader);
      }
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableArray.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableArray.forEach(row => this.selection.select(row.item_code));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  openSearchDialog() {
		const diaogRef = this.dialog.open(SearchViaNameComponent, {
			width: '20%',
			height: '30%',
			position: {
				top: '10%'
			},
			data: {}
		});
		diaogRef.afterClosed().subscribe((result: any) => {
			if (result) {
        console.log(result);
        this.searchForm.patchValue({
          searchId : result.adm_no
        });
        this.searchUser();
        
			}
		});
	}
}
