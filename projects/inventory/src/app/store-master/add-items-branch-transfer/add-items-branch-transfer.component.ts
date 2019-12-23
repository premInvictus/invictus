import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from '../../_services';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-items-branch-transfer',
  templateUrl: './add-items-branch-transfer.component.html',
  styleUrls: ['./add-items-branch-transfer.component.css']
})
export class AddItemsBranchTransferComponent implements OnInit {

  constructor(private commonService: CommonAPIService,
    private fbuild: FormBuilder) { }
  btItems: any = {};
  formGroupArray: any = [];
  itemArray: any[] = [];
  itemCode: any;
  currentLocationId: any;
  allLocationData: any[] = [];
  locationDataArray: any[] = [];
  ngOnInit() {
    this.btItems = this.commonService.getBranchItems();
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
  getItemPerId(item, index) {
    this.formGroupArray[index].formGroup.patchValue({
      item_name: item.item_name
    });

  }
  getFilterLocation(locationData, index) {
    console.log(index);
    this.formGroupArray[index].formGroup.value.item_location = this.currentLocationId;
    this.currentLocationId = locationData.location_id;
    this.locationDataArray.push(locationData);
  }
  openSubmitModal() {
    console.log(this.formGroupArray);
  }
}
