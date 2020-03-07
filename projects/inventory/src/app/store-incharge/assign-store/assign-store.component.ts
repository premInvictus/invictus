import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-assign-store',
  templateUrl: './assign-store.component.html',
  styleUrls: ['./assign-store.component.css']
})
export class AssignStoreComponent implements OnInit {
  assignStoreForm: FormGroup;
  existForm: FormGroup;
  currentLocationId: any;
  created_date: any;
  locationDataArray: any[] = [];
  allLocationData: any[] = [];
  itemArray: any[] = [];
  formGroupArray: any[] = [];
  employeeArray: any[] = [];
  locationArray: any[] = [];
  disableApiCall = false;
  employeeId: any;
  locationId: any;
  assignEmpArray: any = {};
  tableDataArray: any[] = [];
  showDefaultData = false;
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.inventory.getAssignEmp()) {
      this.assignEmpArray = this.inventory.getAssignEmp();
      if (this.assignEmpArray) {
        this.showDefaultData = true;
        this.existForm.patchValue({
          exist_location_id: this.assignEmpArray.location_id.location_hierarchy,
          exist_emp_id: this.assignEmpArray.emp_name
        });
        this.locationId = Number(this.assignEmpArray.item_location);
        this.editAssignData(this.assignEmpArray);
        this.inventory.resetAssignEmp();
      }
    }
  }
  buildForm() {
    this.assignStoreForm = this.fbuild.group({
      emp_id: '',
      location_id: ''
    });
    this.existForm = this.fbuild.group({
      exist_location_id: '',
      exist_emp_id: ''
    });
    this.formGroupArray = [];
  }

  searchStudentByName($event) {
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        const inputJson = {
          "filters": [
            {
              "filter_type": "emp_name",
              "filter_value": $event.target.value,
              "type": "text"
            }
          ]
        };
        this.employeeArray = [];
        this.commonService.getFilterData(inputJson).subscribe((result: any) => {
          if (result.status === 'ok') {
            this.employeeArray = result.data;
          }
        });
      }
    }
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

  getLocationId(item: any) {
    this.locationId = item.location_id;
    this.assignStoreForm.patchValue({
      location_id: item.location_name
    });
  }


  getEmpId(item: any) {
    this.employeeId = item.emp_login_id;
    this.assignStoreForm.patchValue({
      emp_id: item.emp_name
    });
  }

  getFilterLocation(locationData) {
    this.currentLocationId = locationData.location_id;
    this.locationDataArray.push(locationData);
    //console.log(this.currentLocationId);
  }
  getItemList() {
    if (this.assignStoreForm.valid && this.employeeId) {
      this.inventory.checkItemOrLocation({ emp_id: this.employeeId, item_location: this.locationId }).subscribe((result: any) => {
        if (result) {
          this.tableDataArray = [];
          this.formGroupArray = [];
          this.itemArray = [];
          this.commonService.showSuccessErrorMessage(result, 'error');
        } else {
          this.tableDataArray = [];
          this.formGroupArray = [];
          this.itemArray = [];
          var filterJson = {
            "filters": [
              {
                "filter_type": "item_location",
                "filter_value": this.locationId,
                "type": "autopopulate"
              }
            ],
            "page_index": 0,
            "page_size": 100
          };
          this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
            if (result && result.status === 'ok') {
              this.itemArray = result.data;
              for (let item of this.itemArray) {
                this.tableDataArray.push({
                  item_code: item.item_code,
                  item_name: item.item_name,
                  item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
                  item_selling_price: ''
                });
                this.formGroupArray.push({
                  formGroup: this.fbuild.group({
                    item_code: item.item_code,
                    item_name: item.item_name,
                    item_quantity: item.item_location[0].item_qty,
                    item_selling_price: ''
                  })
                });
              }
            } else {
              this.commonService.showSuccessErrorMessage('No item added this location', 'error');
            }
          });
        }
      });


    } else {
      this.commonService.showSuccessErrorMessage('please fill required field', 'error');
    }

  }
  finalSubmit() {
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    finalJson = {
      emp_id: this.employeeId,
      emp_name: this.assignStoreForm.value.emp_id,
      item_location: Number(this.locationId),
      item_assign: itemAssign
    }
    this.inventory.insertStoreIncharge(finalJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Price added Successfully', 'success');
        this.finalCancel();
      } else {
        this.commonService.showSuccessErrorMessage(result, 'error');
      }
    });
  }
  finalUpdate() {
    var finalJson: any = {};
    const itemAssign: any[] = [];
    for (let item of this.formGroupArray) {
      itemAssign.push(item.formGroup.value);
    }
    finalJson = {
      emp_id: this.assignEmpArray.emp_id,
      item_location: Number(this.assignEmpArray.item_location),
      item_assign: itemAssign
    }
    this.inventory.updateStoreIncharge(finalJson).subscribe((result: any) => {
      if (result) {
        this.commonService.showSuccessErrorMessage('Price updated Successfully', 'success');
        this.finalCancel();
        this.inventory.receipt.next({ 'currentTab': 1 });
      } else {
        this.commonService.showSuccessErrorMessage(result, 'error');
      }
    });
  }
  finalCancel() {
    this.formGroupArray = [];
    this.assignEmpArray = [];
    this.tableDataArray = [];
    this.itemArray = [];
    this.assignStoreForm.patchValue({
      'emp_id': '',
      'location_id': ''
    });
    this.showDefaultData = false;
  }
  editAssignData(itemArray) {
    this.tableDataArray = [];
    this.formGroupArray = [];
    this.itemArray = [];
    var filterJson = {
      "filters": [
        {
          "filter_type": "item_location",
          "filter_value": this.locationId,
          "type": "autopopulate"
        }
      ],
      "page_index": 0,
      "page_size": 100
    };
    this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.itemArray = result.data;
        for (let item of this.itemArray) {
          this.tableDataArray.push({
            item_code: item.item_code,
            item_name: item.item_name,
            item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
            item_selling_price: this.getSellingPrice(item.item_code)
          });
          this.formGroupArray.push({
            formGroup: this.fbuild.group({
              item_code: item.item_code,
              item_name: item.item_name,
              item_quantity: item.item_location[0].item_qty,
              item_selling_price: this.getSellingPrice(item.item_code)
            })
          });
        }
      } else {
        this.commonService.showSuccessErrorMessage('No item added this location', 'error');
      }
    });
  }
  getSellingPrice(item_code) {
    const findex = this.assignEmpArray.item_assign.findIndex(f => Number(f.item_code) === Number(item_code));
    if (findex !== -1) {
      return this.assignEmpArray.item_assign[findex].item_selling_price
    } else {
      return '';
    }
  }
}
