import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {BundleModalComponent} from '../../inventory-shared/bundle-modal/bundle-modal.component';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { IndianCurrency } from 'projects/admin-app/src/app/_pipes';

@Component({
  selector: 'app-assign-store',
  templateUrl: './assign-store.component.html',
  styleUrls: ['./assign-store.component.css']
})
export class AssignStoreComponent implements OnInit,OnDestroy {
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
  tableDataArrayMain: any[] = [];
  showDefaultData = false;
  currentChildTab='';
  bundleArray: any[] = [];
  edit = false;
  bundleArrayMain: any[] = [];
  schoolInfo: any;
  currentTabIndex: number;
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
    this.getSchool();
    this.getAllEmployee();
    this.buildForm();
    if (this.inventory.getAssignEmp()) {
      this.assignEmpArray = this.inventory.getAssignEmp();
      console.log('this.assignEmpArray',this.assignEmpArray);
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
      if(this.inventory.getcurrentChildTab() == 'bundlelist') {
        this.getBundle();
      }
    }
    this.inventory.receipt.subscribe((result: any) => {
      if (result) {
        console.log('result.currentChildTab',result.currentChildTab);
        this.inventory.setcurrentChildTab(result.currentChildTab);
        this.currentChildTab = result.currentChildTab;
        if(result.currentChildTab == 'bundlelist') {
          // this.getBundle();
        }
      }
    })
  }
  ngOnDestroy(){
    this.inventory.setcurrentChildTab('');
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
  applyFilter(filterValue: string) {
		// this.bundleArray
    // console.log("i am here", filterValue, this.bundleArrayMain, this.formGroupArray);
    // if(this.bundleArrayMain.length > 0) {
    //   this.bundleArray = this.bundleArrayMain.filter((el) => {
    //     return el.item_name.includes(filterValue) || el.item_code == (filterValue)
    //   })
    //   this.formGroupArray = this.formGroupArray.filter((el) => {
    //     return el.formGroup.value.item_name.includes(filterValue) || el.item_code == (filterValue)
    //   })
    // }
    // this.formGroupArray = [];
    // this.tableDataArrayMain = [];
    let carr = [];
    let frr = [];
    console.log("i am here", filterValue.toLowerCase(), this.tableDataArrayMain);
    if(this.bundleArrayMain.length > 0 ){
      this.bundleArrayMain.map((el) => {
        if(el.item_name.toLowerCase().includes(filterValue.toLowerCase()) ) {
          console.log("i am here", el.item_name, filterValue);
          
          carr.push(el);
          frr.push({
            formGroup: this.fbuild.group({
              item_code: el.item_code,
              item_name: el.item_name,
              item_quantity: el.item_quantity,
              item_selling_price: el.item_selling_price
            })
          });
        }
        
      });
      if(frr.length > 0 ) {
        this.bundleArray = carr;
        this.formGroupArray = frr;
      }
      
    }
    carr = [];
    frr = [];
    console.log("i am here", filterValue.toLowerCase(), this.tableDataArrayMain);
    if(this.tableDataArrayMain.length > 0 ){
      this.tableDataArrayMain.map((el) => {
        if(el.item_name.toLowerCase().includes(filterValue.toLowerCase()) ) {
          console.log("i am here", el.item_name, filterValue);
          
          carr.push(el);
          // frr.push({
          //   formGroup: this.fbuild.group({
          //     item_code: el.item_code,
          //     item_name: el.item_name,
          //     item_quantity: el.item_quantity,
          //     item_selling_price: el.item_selling_price
          //   })
          // });
        }
        
      });
      if(carr.length > 0 ) {
        this.tableDataArray = carr;
        // this.formGroupArray = frr;
      }
      
    }
    
	}
  editstoreincharge(){
    this.edit = true;
    if(this.assignEmpArray){
      this.assignStoreForm.patchValue({
        'emp_id': this.assignEmpArray.employees.map(e => e.emp_id),
        'location_id': this.assignEmpArray.location_id.location_id
      });
    }
    
  }


	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log('this.schoolInfo 202', this.schoolInfo)
				this.schoolInfo['disable'] = true;
				this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
				this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
			}
		});
	}

	downloadPdf() {
		const doc = new jsPDF('p', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
	}

	downloadExcel() {
		alert("Under Construction");
	}
  getAllEmployee(){
    this.employeeArray = [];
    this.commonService.getAllEmployee({emp_cat_id:2}).subscribe((result: any) => {
      if (result.length > 0) {
        this.employeeArray = result;
      }
    });
    // this.commonService.getFilterData({}).subscribe((result: any) => {
    //   if (result.status === 'ok') {
    //     tgetSchoolhis.employeeArray = result.data;
    //   }
    // });
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
  getBundle(){
    this.bundleArray = [];
    this.bundleArrayMain = [];
    const param:any = {};
    param.item_location =  this.assignEmpArray.location_id.location_id,
    this.inventory.getAllBundle(param).subscribe((result:any) => {
      if(result && result.length > 0) {
        this.bundleArray = result;
        this.bundleArrayMain = result;
        this.bundleArray.forEach(element => {
          let itemNameArr:any[]=[];
          element.item_assign.forEach(e => {
            itemNameArr.push(new TitleCasePipe().transform(e.selling_item.item_name));
          });
          element['itemNameArr'] = itemNameArr.join(', ');
        });
        console.log('this.bundleArray',this.bundleArray);
      }
    })
  }
  // getItemList() {
  //   if (this.assignStoreForm.valid && this.employeeId) {
  //     this.inventory.checkItemOrLocation({ emp_id: this.employeeId, item_location: this.locationId }).subscribe((result: any) => {
  //       if (result) {
  //         this.tableDataArray = [];
  //         this.formGroupArray = [];
  //         this.itemArray = [];
  //         this.commonService.showSuccessErrorMessage(result, 'error');
  //       } else {
  //         this.tableDataArray = [];
  //         this.formGroupArray = [];
  //         this.itemArray = [];
  //         var filterJson = {
  //           "filters": [
  //             {
  //               "filter_type": "item_location",
  //               "filter_value": this.locationId,
  //               "type": "autopopulate"
  //             }
  //           ],
  //           "page_index": 0,
  //           "page_size": 100
  //         };
  //         this.inventory.filterItemsFromMaster(filterJson).subscribe((result: any) => {
  //           if (result && result.status === 'ok') {
  //             this.itemArray = result.data;
  //             for (let item of this.itemArray) {
  //               this.tableDataArray.push({
  //                 item_code: item.item_code,
  //                 item_name: item.item_name,
  //                 item_quantity: item.item_location ? item.item_location[0].item_qty : '0',
  //                 item_selling_price: ''
  //               });
  //               this.formGroupArray.push({
  //                 formGroup: this.fbuild.group({
  //                   item_code: item.item_code,
  //                   item_name: item.item_name,
  //                   item_quantity: item.item_location[0].item_qty,
  //                   item_selling_price: ''
  //                 })
  //               });
  //             }
  //           } else {
  //             this.commonService.showSuccessErrorMessage('No item added this location', 'error');
  //           }
  //         });
  //       }
  //     });


  //   } else {
  //     this.commonService.showSuccessErrorMessage('please fill required field', 'error');
  //   }

  // }
  getItemList() {
    if (this.assignStoreForm.valid) {
      this.tableDataArray = [];
      this.tableDataArrayMain = [];
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
            "page_index": 0
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
                this.tableDataArrayMain.push({
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
    const emp:any[] = [];
    for(let item of this.assignStoreForm.value.emp_id){
      const temp = this.employeeArray.find(e => e.emp_login_id == item);
      if(temp){
        emp.push({emp_id:temp.emp_login_id,emp_name: temp.emp_name,emp_login_id:temp.emp_login_id})
      }
    }
    finalJson = {
      employees: emp,
      item_location: Number(this.locationId),
      item_assign: itemAssign
    }
    this.inventory.insertStoreIncharge(finalJson).subscribe((result: any) => {
      if (result) {
        if(result != "User is already assigned the store"){
          this.commonService.showSuccessErrorMessage('Price added Successfully', 'success');
        } else {
          this.commonService.showSuccessErrorMessage('User is already assigned the store', 'error');
        }
        
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
    const emp:any[] = [];
    for(let item of this.assignStoreForm.value.emp_id){
      const temp = this.employeeArray.find(e => e.emp_login_id == item);
      if(temp){
        emp.push({emp_id:temp.emp_login_id,emp_name: temp.emp_name,emp_login_id:temp.emp_login_id})
      }
    }
    finalJson = {
      employees: emp,
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
    this.tableDataArrayMain = [];
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
      "page_index": 0
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
  addBundle(value=null){
    console.log('this.assignEmpArray',this.assignEmpArray);
    const item : any = {};
    if(value){
      item.title = 'Update Bundle';
      item.edit = true;
      
    } else {
      item.title = 'Add Bundle';
      item.edit = false;
    }
    item.value = value;
    item.emp_id = this.assignEmpArray.emp_id;
    item.item_location = this.assignEmpArray.item_location;
    const dialogRef = this.dialog.open(BundleModalComponent, {
      width: '50%',
      height: '500',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.status == 'ok'){
        this.getBundle();
      }
    });
  }
  deleteBundle(item){
    console.log(item);
    let param:any = {};
    param.bundle_id = item.bundle_id;
    param.status = '5';
    this.inventory.updateBundle(param).subscribe((result:any) => {
      if(result){
        this.commonService.showSuccessErrorMessage('Updated Successfully','success');
        this.getBundle();
      } else {
        this.commonService.showSuccessErrorMessage('Updated Failed','error');
      }
    })
  }
}
