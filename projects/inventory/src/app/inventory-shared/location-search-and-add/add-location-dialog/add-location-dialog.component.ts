import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService } from '../../../_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../../ConfirmValidParentMatcher';

@Component({
  selector: 'add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['./add-location-dialog.component.css'],
})
export class AddLocationDialog implements OnInit {
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  locationForm: FormGroup;
  configValue: any;
  currentUser: any;
  session: any;
  locationArray: any[] = [];
  locationTypeArray: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private fbuild: FormBuilder,
    private commonAPIService: CommonAPIService,
    public dialogRef: MatDialogRef<AddLocationDialog>) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getLocationType();
    this.buildForm();
    this.getLocation();
  }

  buildForm() {
    this.locationForm = this.fbuild.group({
      location_id: '',
      location_name: '',
      location_parent_id: '',
      location_type_id: '',
      location_status: ''
    });
  }

  getLocationType() {
    var inputJson = {};
    this.commonAPIService.getMaster({ type_id: '11' }).subscribe((result: any) => {
      if (result) {
        this.locationTypeArray = result;
      } else {
        this.locationTypeArray = [];
      }
    });
  }

  getLocation() {
    var inputJson = {};
    this.commonAPIService.getLocation(inputJson).subscribe((result: any) => {
      if (result) {
        this.locationArray = result;
      } else {
        this.locationArray = [];
      }
    });
  }

  save() {
    var inputJson = {
      location_id: this.locationForm.value.location_id ? this.locationForm.value.location_id : 0,
      location_parent_id: this.locationForm.value.location_parent_id ? this.locationForm.value.location_parent_id : 0,
      location_type_id: this.locationForm.value.location_type_id ? this.locationForm.value.location_type_id : 0,
      location_name: this.locationForm.value.location_name ? this.locationForm.value.location_name : '',
      location_status: this.locationForm.value.location_status ? this.locationForm.value.location_status : 1,
      location_hierarchy: this.getLocationHierarchy(this.locationForm.value.location_parent_id) ? this.getLocationHierarchy(this.locationForm.value.location_parent_id) + this.locationForm.value.location_name : this.locationForm.value.location_name,
    };
    this.commonAPIService.insertLocation(inputJson).subscribe((result) => {
      if (result) {
        this.commonAPIService.showSuccessErrorMessage('Location Saved Successfully', 'success');
        this.resetForm();
      } else {
        this.commonAPIService.showSuccessErrorMessage('Error While Saving Location', 'error');
      }
    });

  }

  getLocationHierarchy(location_parent_id) {
    var hierarchy_name = '';
    if (location_parent_id) {
      for (const item of this.locationArray) {
        if (Number(item.location_id) === Number(location_parent_id)) {
          hierarchy_name = item.location_hierarchy + "-";
          if (item.location_parent_id > 0) {
            this.getLocationHierarchy(item.location_parent_id);
          }

        }
      }
    }
    return hierarchy_name;
  }

  resetForm() {
    this.locationForm.reset();
  }

}