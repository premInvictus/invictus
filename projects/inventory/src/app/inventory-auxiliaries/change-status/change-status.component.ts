import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { InventoryService, CommonAPIService, SisService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.css']
})
export class ChangeStatusComponent implements OnInit {

  itemArray: any[] = [];
  itemData: any[] = [];
  changeStatusForm: FormGroup;
  searchForm: FormGroup;
  currentUser: any;
  detailsFlag = false;
  val: any;
  change_typeArray: any[] = [];
  change_toArray: any[] = [];
  locationArray: any[] = [];
  reasonArray: any[] = [];
  isLoading = false;
  toHighlight: string = '';
  allLocationData: any[] = [];
  constructor(
    private inventoryService: InventoryService, 
    private commonAPIService: CommonAPIService,
    private fbuild: FormBuilder,
    private sisService: SisService,
    private erpCommonService: ErpCommonService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.change_typeArray = [{id: 'status', name:'Status'}, {id: 'location', name:'Location'}];
    this.change_toArray = [{id: 'repair', name:'Repair'}, {id: 'damaged', name:'Damaged'}];
    this.buildForm();
    this.getReasons();
  }
  getReasons() {
    this.reasonArray = [];
		this.sisService.getReason({ reason_type: 16 }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.reasonArray = res.data;
			}
		});
	}
  buildForm() {
		this.changeStatusForm = this.fbuild.group({
      'change_type': '',
      'change_to': '',
      'change_qty': '',
      'change_location_name': '',
      'change_location_id': '',
      'location_id': '',
			'reason_id': '',
			'reason_desc': ''
    });
    this.searchForm = this.fbuild.group({
			search: '',
			page_size: 1,
			page_index: 0,
			role_id: this.currentUser.role_id
		});
  }
  getItems($event) {
    if ($event.target.value) {
      this.val = $event.target.value
      if (this.val.length >= 3) {
        this.searchItem();
      }
    }
  }
  resetFilter(){
    this.changeStatusForm.patchValue({
      change_to: '',
      change_qty: '',
      change_location_name: '',
      change_location_id:'',
      location_id:'',
      reason_id:'',
      reason_desc:''
    });
  }
  searchItem(){
    this.itemArray = [];
    const param: any = {};
    const json = {
      searchData: this.val
    };
    this.detailsFlag = false
    this.inventoryService.searchItemsFromMaster(json).subscribe((result: any) => {
      if(result && result.status === 'ok'){
        this.itemArray = result.data;
        const DATA = this.itemArray.reduce((current, next, index) => {
          const location = next.locs.reduce((current1, next1, index1) => {
            next1.item_qty = next.item_location[index1].item_qty;
            current1.push(next1);
            return current1;
          },[]);
          location.forEach(element => {
            this.locationArray.push({location_id: element.location_id, location_name: element.location_hierarchy});
            current.push({
              item_code: next.item_code,
              item_name: next.item_name,
              item_nature: next.item_nature.name,
              item_category: next.item_category.name,
              item_desc: next.item_desc,
              location_hierarchy: element.location_hierarchy,
              location_name: element.location_name,
              location_id: element.location_id,
              item_qty: element.item_qty,
              item_units_name: next.item_units.name
            })
          })
          return current;
        },[]);
        var clean = this.locationArray.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.location_id === arr.location_id)))
        this.locationArray = clean;
        this.itemData = DATA;
        console.log(this.itemData);
        this.detailsFlag = true;        
      } else {
        this.itemData=[];
        this.locationArray = [];
        this.detailsFlag = true;  
      }
    })
  }
  validation(value): boolean {
    let validation = true;
    if(value.location_id) {
      for (let index = 0; index < this.itemData.length; index++) {
        const element = this.itemData[index];
        if(element.location_id === value.location_id) {
          if(value.change_qty > -1 && element.item_qty < value.change_qty) {
            return false;
          }
        }
      }
    } else {
      validation = false;
    }
    return validation;
  }
  submit(){
    if(this.validation(this.changeStatusForm.value)) {
      const sourceLocationFilteredData = this.itemData.reduce((current, next, index) => {
        if(next.location_id === this.changeStatusForm.value.location_id) {
          current.push(next);
        }
        return current;
      }, []);
      console.log('sourceLocationFilteredData', sourceLocationFilteredData);
      const param: any = {};
      param.filter = this.changeStatusForm.value;
      param.filterData = sourceLocationFilteredData;
      this.inventoryService.itemChangeStatus(param).subscribe((result: any) => {
        if(result.status === 'ok') {
          console.log(result);
          this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
          this.searchItem();
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error')
        }
      })
    } else {
      this.commonAPIService.showSuccessErrorMessage('Selected item qty must be less than resulted item current stock', 'error');
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
  setLocationId(locationDetails, i) {
    if(locationDetails) {
      console.log(locationDetails);
      this.changeStatusForm.patchValue({
        change_location_id: locationDetails.location_id,
        change_location_name: locationDetails.location_hierarchy
      })
    }
  }

}
