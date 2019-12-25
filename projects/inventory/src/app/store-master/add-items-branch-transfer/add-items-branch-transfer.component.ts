import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-items-branch-transfer',
  templateUrl: './add-items-branch-transfer.component.html',
  styleUrls: ['./add-items-branch-transfer.component.css']
})
export class AddItemsBranchTransferComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  btItems: any = {};
  submitParam: any = {};
  formGroupArray: any = [];
  itemArray: any[] = [];
  finalArray: any[] = [];
  itemCode: any;
  currentLocationId: any;
  allLocationData: any[] = [];
  locationDataArray: any[] = [];
  constructor(
    private commonService: CommonAPIService,
    private inventory: InventoryService, private router: Router,
    private route: ActivatedRoute,
    private fbuild: FormBuilder) { }
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
          item_quantity: item.item_quantity
        })
      })
    }
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
    this.currentLocationId = locationData.location_id;
    this.formGroupArray[index].formGroup.value.item_location = this.currentLocationId;
    this.locationDataArray.push(locationData);
  }

  //  Open Final Submit Modal function
  openSubmitModal() {
    let updateFlag = false;
    let index = 0;
    this.finalArray = [];
    for (let item of this.formGroupArray) {
      if (this.formGroupArray[index].formGroup.valid) {
        if (item.formGroup.value.item_location !== '') {
          this.finalArray.push(item.formGroup.value);
          updateFlag = true;
        } else {
          updateFlag = false;
          break;
        }
      } else {
        updateFlag = false;
        break;
      }
      index++;
    }
    if (updateFlag && this.finalArray.length > 0) {
      this.submitParam.text = 'Add Items ';
      this.deleteModal.openModal(this.submitParam);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  finalSubmit($event) {
    let finalObj: any = {};
    if ($event) {
      finalObj['pm_item_details'] = this.finalArray;
      this.inventory.updateItemQuantity(finalObj).subscribe((result_p: any) => {
        if (result_p) {
          this.btItems['status'] = 'approved';
          this.inventory.updateBranchTransfer(this.btItems).subscribe((result_q: any) => {
            if (result_q) {
              this.router.navigate(['../procurement-master'], { relativeTo: this.route });
              this.inventory.setTabIndex({ 'currentTab': 3 });
            }
          });
        }
      }
      );
    }
  }
  finalCancel() {
    this.router.navigate(['../procurement-master'], { relativeTo: this.route });
    this.inventory.setTabIndex({ 'currentTab': 3 });
  }

}
