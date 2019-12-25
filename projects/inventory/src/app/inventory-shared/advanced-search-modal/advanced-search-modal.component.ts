import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SisService, AxiomService, CommonAPIService, InventoryService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { FeeService } from 'projects/fee/src/app/_services';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.css']
})
export class AdvancedSearchModalComponent implements OnInit {
  dialogRef: MatDialogRef<AdvancedSearchModalComponent>;
  @ViewChild('searchModal') searchModal;
  @Output() searchOk = new EventEmitter;
  formGroupArray: any[] = [];
  placeholder: any[] = [];
  fieldType: any[] = [];
  natureArray: any[] = [];
  categoryArray: any[] = [];
  unitsArray: any[] = [];
  currentUser: any = {};
  allLocationData: any[] = [];
  isLoading = false;
  toHighlight: string = '';
  checkLocationArray: any[] = [];
  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private erpCommonService: ErpCommonService,
    private service: InventoryService) { }
  filterArray: any[] = [
  ];
  generalFilterForm: FormGroup;
  ngOnInit() {
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getItemNature();
    this.getItemCategory();
    this.getItemUnits();
    this.filterArray = [
      {
        id: 'item_code',
        name: 'Item Code',
        type: 'text',
        placeholder: 'Search item by code'
      },
      {
        id: 'item_name',
        name: 'Item Name',
        type: 'text',
        placeholder: 'Search item by Item Name'
      },
      {
        id: 'item_location',
        name: 'Location',
        placeholder: 'Search item by location',
        type: 'autopopulate',
      }
    ];
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.formGroupArray = [];
    this.buildForm();
  }
  setPlaceHolder(val, index) {
    this.checkLocationArray[index] = false;
    const findex = this.filterArray.findIndex(f => f.id === val);
    if (findex !== -1) {
      if (this.filterArray[findex].type === 'autopopulate') {
        this.checkLocationArray[index] = true;
      } else {
        this.checkLocationArray[index] = false;
      }
      this.placeholder[index] = this.filterArray[findex].placeholder;
      this.fieldType[index] = this.filterArray[findex].type;
      this.formGroupArray[index].formGroup.patchValue({
        'type': this.filterArray[findex].type
      });
    }
  }
  getFilterLocation(event) {
    var inputJson = { 'filter': event.target.value };
    if (event.target.value && event.target.value.length > 2) {
      this.toHighlight = event.target.value
      this.isLoading = true;
      this.erpCommonService.getFilterLocation(inputJson).subscribe((result: any) => {
        this.allLocationData = [];
        if (result) {
          this.isLoading = false;
          for (var i = 0; i < result.length; i++) {
            this.allLocationData.push(result[i]);
          }
        }
      });
    } else {
      this.allLocationData = [];
    }
  }
  addNewFilter(index) {
    this.formGroupArray.push({
      id: index + 1,
      formGroup: this.fbuild.group({
        'filter_type': '',
        'filter_value': '',
        'type': ''
      })
    });
    this.checkLocationArray.push(false);
  }
  setLocationId(locationDetails, i) {
    this.formGroupArray[i].formGroup.patchValue({
      filter_value: locationDetails.location_hierarchy,
    });
  }
  deleteForm(i) {
    const findex = this.formGroupArray.findIndex(f => Number(f.id) === i);
    if (findex !== -1) {
      this.formGroupArray.splice(findex, 1);
      this.checkLocationArray[findex] = false;
    }
  }
  buildForm() {
    this.formGroupArray = [
      {
        id: '1',
        formGroup: this.fbuild.group({
          'filter_type': '',
          'filter_value': '',
          'type': ''
        })
      }
    ];
    this.checkLocationArray.push(false);
    const obj: any = {};
    obj['item_nature.id'] = '';
    obj['item_category.id'] = '';
    obj['user'] = JSON.parse(localStorage.getItem('currentUser'));
    obj['from'] = '';
    obj['to'] = '';
    this.generalFilterForm = this.fbuild.group(obj);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    const dataArr: any[] = [];
    for (const item of this.formGroupArray) {
      dataArr.push(item.formGroup.value);
    }
    if (this.generalFilterForm.value.from_date || this.generalFilterForm.value.to_date) {
      this.generalFilterForm.patchValue({
        from_date: new DatePipe('en-in').transform(this.generalFilterForm.value.from_date, 'yyyy-MM-dd'),
        to_date: new DatePipe('en-in').transform(this.generalFilterForm.value.to_date, 'yyyy-MM-dd')
      });
    }
    this.searchOk.emit({
      filters: dataArr,
      generalFilters: this.generalFilterForm.value
    });
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }
  getFromDate(value) {
    this.generalFilterForm.patchValue({
      from: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.generalFilterForm.patchValue({
      to: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getItemCategory() {
    this.service.getDroppableFromMaster({
      type_id: '9'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.categoryArray = res;
      } else {
        this.categoryArray = [];
      }
    });
  }
  getItemNature() {
    this.service.getDroppableFromMaster({
      type_id: '8'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.natureArray = res;
      } else {
        this.natureArray = [];
      }
    });
  }
  getItemUnits() {
    this.service.getDroppableFromMaster({
      type_id: '10'
    }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.unitsArray = res;
      } else {
        this.unitsArray = [];
      }
    });
  }

}
