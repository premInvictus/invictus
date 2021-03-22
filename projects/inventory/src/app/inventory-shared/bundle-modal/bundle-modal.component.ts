import { Component, OnInit, Input,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CommonAPIService, InventoryService } from '../../_services';
import {SelectionModel} from '@angular/cdk/collections';



@Component({
  selector: 'app-bundle-modal',
  templateUrl: './bundle-modal.component.html',
  styleUrls: ['./bundle-modal.component.css']
})
export class BundleModalComponent implements OnInit {

  itemDetails: any;
  detailsFlag = false;
  itemSearchForm: FormGroup;

  currentUser: any;
  showReturnIssueSection = false;
  previewTableFlag = false;
  itemArray: any = [];
  tableArray: any = [];
  schoolInfo: any;
  formGroupArray: any[] = [];
  tableReciptArray: any[] = [];
  tableHeader: any;
  storeinchargeDetails:any;
  locationArray: any[] = [];
  locationId: any;
  selection = new SelectionModel<any>(true, []);

  constructor(
    public dialogRef: MatDialogRef<BundleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private inventory: InventoryService,
    private fbuild: FormBuilder,
    private common: CommonAPIService,


  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    if(this.data.value) {
      this.tableArray = [];
      this.selection.clear();
      this.itemSearchForm.patchValue({
        bundle_id:this.data.value.bundle_id,
        bundle_name:this.data.value.bundle_name
      })
      if(this.data.value.item_assign && this.data.value.item_assign.length > 0){
        this.data.value.item_assign.forEach(item => {
          this.tableArray.push({
            item_code: item.item_code,
            item_name: item.selling_item.item_name,
            item_selling_price: item.selling_item.item_selling_price,
            item_optional: item.item_optional,
          });
          if(item.item_optional == '1'){
            this.selection.toggle(item.item_code);
          }
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              item_quantity: item.item_quantity ? item.item_quantity : 1,
            })
          });
        });
      }
    }
  }
  buildForm() {
    this.itemSearchForm = this.fbuild.group({
      bundle_id:'',
      bundle_name:'',
      scanItemId: ''
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
  searchItemData() {
    const findex = this.itemArray.findIndex(f => Number(f.item_code) === Number(this.itemSearchForm.value.scanItemId));
    if (findex !== -1) {
      this.common.showSuccessErrorMessage('Item Already exist in the cart', 'error');
    } else {
      let inputJson: any = {};
      inputJson = {
        emp_id: this.data.emp_id,
        item_code: Number(this.itemSearchForm.value.scanItemId)
      }
      this.inventory.getStoreIncharge(inputJson).subscribe((result: any) => {
        if (result.length > 0) {
          this.storeinchargeDetails = result[0];
          const item = result[0].item_assign[0];
          this.tableArray.push({
            item_code: item.item_code,
            item_name: item.item_name,
            item_selling_price: item.item_selling_price,
            item_optional: '',
          });
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              item_quantity: 1,
            })
          });
        } else {
          this.common.showSuccessErrorMessage('Item is not available at store', 'error');
        }
      })
    }

  }
  getTotalPriceRow(index) {
    if (this.formGroupArray[index].formGroup.value.item_quantity) {
      return Number(this.tableArray[index].item_selling_price
      ) * Number(this.formGroupArray[index].formGroup.value.item_quantity)
    } else {
      return '-';
    }
  }
  getTotalPrice(index) {
    let sum=0;
    for (let index = 0; index < this.tableArray.length; index++) {
      const element = this.tableArray[index];
      sum += Number(this.tableArray[index].item_selling_price) * Number(this.formGroupArray[index].formGroup.value.item_quantity)
    }
    return sum;
  }
  closeDialog(value=null){
    this.dialogRef.close(value);
  }
  finalSubmit() {
    var finalJson: any = {};
    const itemAssign: any[] = [];
    let i=0;
    for (let item of this.tableArray) {
      const temp:any = {};
      const findex = this.selection.selected.findIndex(e => e == item.item_code);
      temp.item_code = item.item_code;
      temp.item_quantity = this.formGroupArray[i].formGroup.value.item_quantity ? this.formGroupArray[i].formGroup.value.item_quantity : 1;
      temp.item_optional = findex != -1 ? '1' : '0';
      itemAssign.push(temp);
      i++;
    }
    finalJson = {
      emp_id : this.data.emp_id,
      item_location: this.data.item_location,
      bundle_name: this.itemSearchForm.value.bundle_name,
      item_assign: itemAssign
    }
    if(this.itemSearchForm.value.bundle_id){
      finalJson['bundle_id'] = this.itemSearchForm.value.bundle_id;
      this.inventory.updateBundle(finalJson).subscribe((result: any) => {
        if (result) {
          this.common.showSuccessErrorMessage('Bundle added Successfully', 'success');
          this.closeDialog({status:'ok'});
        } else {
          this.common.showSuccessErrorMessage(result, 'error');
        }
      });
    } else {
      this.inventory.insertBundle(finalJson).subscribe((result: any) => {
        if (result) {
          this.common.showSuccessErrorMessage('Bundle added Successfully', 'success');
          this.closeDialog({status:'ok'});
        } else {
          this.common.showSuccessErrorMessage(result, 'error');
        }
      });
    }   
  }
  removeItem(i){
    this.tableArray.splice(i,1);
    this.formGroupArray.splice(i,1);
    
  }

}