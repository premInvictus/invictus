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
  }
  buildForm() {
    this.itemSearchForm = this.fbuild.group({
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
        } else {
          this.common.showSuccessErrorMessage('Item is not available at store', 'error');
        }
      })
    }

  }
  getTotalPrice(index) {
    return this.tableArray.map(e => e.item_selling_price).reduce((a,b) => a += Number(b),0);
  }
  closeDialog(){
    this.dialogRef.close();
  }
  finalSubmit() {
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.tableArray) {
      const temp:any = {};
      const findex = this.selection.selected.findIndex(e => e == item.item_code);
      temp.item_code = item.item_code;
      temp.item_optional = findex != -1 ? '1' : '0';
      itemAssign.push(temp);
    }
    finalJson = {
      emp_id : this.data.emp_id,
      item_location: this.data.item_location,
      bundle_name: this.itemSearchForm.value.bundle_name,
      item_assign: itemAssign
    }
    console.log(this.selection.selected);
    this.inventory.insertBundle(finalJson).subscribe((result: any) => {
      if (result) {
        this.common.showSuccessErrorMessage('Bundle added Successfully', 'success');
        this.closeDialog();
      } else {
        this.common.showSuccessErrorMessage(result, 'error');
      }
    });
  }

}