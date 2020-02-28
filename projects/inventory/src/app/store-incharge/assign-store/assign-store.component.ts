import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErpCommonService } from 'src/app/_services';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-assign-store',
  templateUrl: './assign-store.component.html',
  styleUrls: ['./assign-store.component.css']
})
export class AssignStoreComponent implements OnInit {
  assignStoreForm: FormGroup;
  currentLocationId: any;
  created_date: any;
  locationDataArray: any[] = [];
  allLocationData: any[] = [];
  constructor(
    private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private erpCommonService: ErpCommonService
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.assignStoreForm = this.fbuild.group({
      emp_id: '',
    });
  }
  getFilterLocation(locationData) {
    this.currentLocationId = locationData.location_id;
    this.locationDataArray.push(locationData);
    console.log(this.currentLocationId);
  }
  getItemList() {
    var filterJson = {
      "filters": [
        {
          "filter_type": "item_location",
          "filter_value": this.currentLocationId

          ,
          "type": "autopopulate"
        }
      ],
      "page_index": 0,
      "page_size": 100
    };
    this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
      }
    })
  }
}
