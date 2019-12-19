import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from '../../_services';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-items-branch-transfer',
  templateUrl: './add-items-branch-transfer.component.html',
  styleUrls: ['./add-items-branch-transfer.component.css']
})
export class AddItemsBranchTransferComponent implements OnInit {

  constructor(private common: CommonAPIService,
    private fbuild: FormBuilder) { }
  btItems: any = {};
  formGroupArray: any = [];
  ngOnInit() {
    this.btItems = this.common.getBranchItems();
    this.getItems(this.btItems)
  }
  getItems(data) {
    for (const item of data.inv_item_details) {
      this.formGroupArray.push({
        formGroup: this.fbuild.group({
          item_name: '',
          item_code: '',
          item_location: '',
          branch_item_name: item.item_name,
          branch_qty: item.item_quantity
        })
      })
    }
    console.log(this.formGroupArray);
  }

}
