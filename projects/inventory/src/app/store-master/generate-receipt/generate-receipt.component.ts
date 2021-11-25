import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErpCommonService } from 'src/app/_services';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import {  IndianCurrency } from '../../_pipes/index';

@Component({
  selector: 'app-generate-receipt',
  templateUrl: './generate-receipt.component.html',
  styleUrls: ['./generate-receipt.component.css']
})
export class GenerateReceiptComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('messageModal') messageModal;
  statusFlag = "approved";
  multipleFileArray: any[] = [];
  imageArray: any[] = [];
  finalDocumentArray: any[] = [];
  counter: any = 0;
  currentFileChangeEvent: any;
  currentImage: any;
  UpdateFlag = false;
  submitParam: any = {};
  createOrderForm: FormGroup;
  searchPoForm: FormGroup;
  finalReceiptForm: FormGroup;
  requistionArray: any[] = [];
  locationDataArray: any[] = [];
  finalSubmitArray: any = {};
  finalReceiptArray: any[] = [];
  setBlankArray: any[] = [];
  itemArray: any[] = [];
  poArray: any[] = [];
  vendorArray: any[] = [];
  itemCode: any;
  vendorCode: any;
  itemCodeArray: any[] = [];
  finalRequistionArray: any[] = [];
  toBePromotedList: any[] = [];
  tableDivFlag = false;
  tabledataFlag = false;
  update_id: any;
  currentUser: any;
  session: any;
  ven_id: any;
  pm_type: any;
  pm_id: any;
  currentLocationId: any;
  created_date: any;
  allLocationData: any[] = [];
  isLoading = false;
  toHighlight: string = '';
  opacityClass = '';
  viewOnly = false;
  schoolInfo: any = {};
  schoolGroupData: any[];
  locationArray: any[];
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
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }
  ngOnInit() {
    this.getSchool();
    this.buildForm();
    if (this.inventory.getrequisitionArray()) {
      this.requistionArray = this.inventory.getrequisitionArray();
     console.log('this.requistionArray', this.requistionArray);
      this.getTablevalue();
    }
  }
  ngAfterViewInit(){
    this.getAllLocations();
  }
  buildForm() {
    this.createOrderForm = this.fbuild.group({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: '',
      item_location: '',
      item_status: ''
    });
    this.searchPoForm = this.fbuild.group({
      po_id: ''
    });
    this.finalReceiptForm = this.fbuild.group({
      ven_id: '',
      ven_name: '',
      ven_address: '',
      ven_authorised_person_detail_contact: '',
      ven_authorised_person_detail_name: '',
      ven_contact: '',
      ven_email: '',
      ven_gst_no: '',
      ven_pan_no: '',
      intended_use: '',
      source: '',
      po_no: '',
      invoice_no: '',
    });

  }

  getTablevalue() {
    for (let item of this.requistionArray) {
      this.ven_id = item.pm_vendor ? item.pm_vendor.ven_id : '';
      this.pm_type = item.pm_type;
      this.pm_id = item.pm_id;
      if (this.pm_id) {
        this.opacityClass = 'opacity-class';
        this.viewOnly = true;
      } else {
        this.opacityClass = '';
        this.viewOnly = false;
      }
      for (let dety of item.pm_item_details) {
        if (dety.item_status === 'pending' || dety.item_status === 'approved') {
          const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
          if (sindex !== -1) {
            this.finalRequistionArray[sindex].item_quantity = Number(this.finalRequistionArray[sindex].item_quantity) + Number(dety.item_quantity);
          } else {
            this.itemCodeArray.push({
              item_code: dety.item_code,
            });
            this.finalRequistionArray.push(dety);
          }
        }
      }
    }
    this.finalReceiptForm.patchValue({
      ven_id: this.ven_id,
      po_no: this.pm_id,
      intended_use: this.requistionArray[0].pm_intended_use
    });
    this.vendor(this.ven_id);
  }

  filterItem($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      //check if no is entered
      const reg = new RegExp('^[0-9]+$');
      if($event.target.value !== ''){
        if($event.target.value.match(reg)){
          this.itemArray = [];
          this.commonService.getItemsFromMaster({ item_code: $event.target.value }).subscribe((result: any) => {
            if (result && result.status === 'ok') {
              console.log("item result ", result);
              this.itemArray = result.data;
            }
          });
        }else if($event.target.value !== '' && $event.target.value.length >= 3) {
          this.itemArray = [];
          this.commonService.getItemsFromMaster({ item_name: $event.target.value }).subscribe((result: any) => {
            if (result && result.status === 'ok') {
              console.log("item result ", result);
              this.itemArray = result.data;
            }
          });
        }
      }
    }
  }
  getItemPerId(item: any) {
    this.itemCode = item.item_code;
    this.createOrderForm.patchValue({
      item_name: item.item_name,
      item_desc: item.item_desc,
      item_units: item.item_units.name
    });
  }
  // Add item list function

  addList() {
    this.allLocationData = [];
    this.getAllLocations();

    if (this.createOrderForm.valid) {
     // console.log(this.createOrderForm.value, 'this.createOrderForm');
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createOrderForm.value.item_code)
        && Number(f.item_location) === Number(this.currentLocationId));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createOrderForm.value.item_code,
          item_location: this.currentLocationId
        });
        this.createOrderForm.value.item_status = 'pending';
        this.createOrderForm.value.item_location = this.currentLocationId;
        this.finalRequistionArray.push(this.createOrderForm.value);
      }
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

  // Add item list function

  editList(value) {
    this.UpdateFlag = true;
    this.update_id = value;
    this.createOrderForm.patchValue({
      'item_code': this.finalRequistionArray[value].item_code,
      'item_name': this.finalRequistionArray[value].item_name,
      'item_desc': this.finalRequistionArray[value].item_desc,
      'item_quantity': this.finalRequistionArray[value].item_quantity,
      'item_units': this.finalRequistionArray[value].item_units,
      'item_price': this.finalRequistionArray[value].item_price,
      'item_location': this.getLocationName(this.finalRequistionArray[value].item_location)
    });
  }

  // update item list function

  updateList() {
    if (this.createOrderForm.valid) {
      this.UpdateFlag = false;
      this.finalRequistionArray[this.update_id] = this.createOrderForm.value;
      this.finalRequistionArray[this.update_id].item_location = this.currentLocationId;
      this.resetForm();
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

  // delete item list function

  deleteList(value) {
    this.finalRequistionArray.splice(value, 1);
  }

  resetForm() {
    this.createOrderForm.patchValue({
      item_code: '',
      item_name: '',
      item_desc: '',
      item_quantity: '',
      item_units: '',
      item_price: '',
      item_location: ''
    });
  }
  resetVendor() {
    this.finalReceiptForm.patchValue({
      ven_name: '',
      ven_address: '',
      ven_authorised_person_detail_contact: '',
      ven_authorised_person_detail_name: '',
      ven_contact: '',
      ven_email: '',
      ven_gst_no: '',
      ven_pan_no: ''
    });
  }
  finalCancel() {
    this.finalRequistionArray = [];
    this.resetForm();
    if (this.requistionArray.length > 0) {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.router.navigate(['../procurement-master'], { relativeTo: this.route });
      this.inventory.setTabIndex({ 'currentTab': 2 });
    } else {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.router.navigate(['../procurement-master'], { relativeTo: this.route });
      this.inventory.setTabIndex({ 'currentTab': 2 });
    }
  }
  //  Open Final Submit Modal function
  openMessageModal() {
    this.submitParam.text = 'Add';
    this.messageModal.openModal(this.submitParam);
  }
  //  Open Final Submit Modal function
  openSubmitModal() {
    if (this.finalReceiptForm.valid) {
      this.submitParam.text = 'Generate Receipt';
      this.deleteModal.openModal(this.submitParam);
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }
  filterVendor($event) {
    // keyCode
    this.resetVendor();
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '') {
        this.vendorArray = [];
        this.erpCommonService.getVendor({ ven_id: Number($event.target.value) }).subscribe((res: any) => {
          if (res && res.status === 'ok') {
            let vendorDetail: any;
            vendorDetail = res.data[0];
            this.finalReceiptForm.patchValue({
              ven_name: vendorDetail.ven_name,
              ven_address: vendorDetail.ven_address,
              ven_authorised_person_detail_contact: vendorDetail.ven_authorised_person_detail_contact,
              ven_authorised_person_detail_name: vendorDetail.ven_authorised_person_detail_name,
              ven_contact: vendorDetail.ven_contact,
              ven_email: vendorDetail.ven_email,
              ven_gst_no: vendorDetail.ven_gst_no,
              ven_pan_no: vendorDetail.ven_pan_no
            })
          }
        });
      }
    }
  }

  vendor(ven_id) {
    // keyCode
    this.resetVendor();
    if (ven_id) {
      this.vendorArray = [];
      this.erpCommonService.getVendor({ ven_id: Number(ven_id) }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          let vendorDetail: any;
          vendorDetail = res.data[0];
          this.finalReceiptForm.patchValue({
            ven_name: vendorDetail.ven_name,
            ven_address: vendorDetail.ven_address,
            ven_authorised_person_detail_contact: vendorDetail.ven_authorised_person_detail_contact,
            ven_authorised_person_detail_name: vendorDetail.ven_authorised_person_detail_name,
            ven_contact: vendorDetail.ven_contact,
            ven_email: vendorDetail.ven_email,
            ven_gst_no: vendorDetail.ven_gst_no,
            ven_pan_no: vendorDetail.ven_pan_no
          })
        }
      });
    }

  }


  getSchool() {
    this.sisService.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        console.log("scholl >>>>>>>>>>>",this.schoolInfo);
        this.getGroupedSchool();
      }
    });
  }

  getGroupedSchool() {
		console.log('this.schoolInfo', this.schoolInfo)
		this.schoolGroupData = [];
		this.sisService.getAllSchoolGroups({si_group:this.schoolInfo.si_group, si_school_prefix: this.schoolInfo.school_prefix}).subscribe((data:any)=>{
			if (data && data.status == 'ok') {
				//this.schoolGroupData = data.data;
				
				console.log('this.schoolGroupData--', data.data);
				this.sisService.getMappedSchoolWithUser({prefix: this.schoolInfo.school_prefix, group_name: this.schoolInfo.si_group, login_id: this.currentUser.login_id}).subscribe((result:any)=>{
					if (result && result.data && result.data.length > 0) {
						
						var userSchoolMappedData = [];
						console.log('result.data--', result.data	)
						for (var j=0; j< result.data.length; j++) {


							if (result.data[j]['sgm_mapped_status'] == "1" || result.data[j]['sgm_mapped_status'] == 1) {
								userSchoolMappedData.push(result.data[j]['sgm_si_prefix']);
							}
						}
						this.schoolGroupData  = [];
						console.log('userSchoolMappedData', userSchoolMappedData)
						for (var i=0; i<data.data.length;i++) {
							if (userSchoolMappedData.indexOf(data.data[i]['si_school_prefix']) > -1) {
								this.schoolGroupData.push(data.data[i]);
							}
						}
						console.log('userSchoolMappedData', this.schoolGroupData);
					}
				})
			}
		})
	}

  finalSubmit($event) {

    let printArray : any ;
    let inv_total = 0;
      
    let newDate = new Date();
    console.log("hello final submit ",this.requistionArray); 
    if ($event) {
      for (let item of this.requistionArray) {
        for (let dety of item.pm_item_details) {
          const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
          if (sindex !== -1) {
            if (Number(dety.item_quantity) === Number(this.finalRequistionArray[sindex].item_quantity)) {
              dety.item_status = 'approved';
            } else {
              dety.item_quantity = Number(dety.item_quantity) - Number(this.finalRequistionArray[sindex].item_quantity);
              dety.item_status = 'pending';
              this.statusFlag = 'pending';
            }
          }
        }
      };
      const currencyPipe = new IndianCurrency();
      this.finalRequistionArray.forEach(element => {
        inv_total += element.item_price * element.item_quantity;
      });
      let total = currencyPipe.transform(inv_total);

      this.finalSubmitArray['pm_item_details'] = this.finalRequistionArray;
      this.finalSubmitArray['pm_intended_use'] = this.finalReceiptForm.value.intended_use;
      this.finalSubmitArray['pm_source'] = 'GR';
      this.finalSubmitArray['pm_type'] = 'GR';
      // if(this.requistionArray[0].pm_created){
      //   this.finalSubmitArray['pm_created'] = this.requistionArray[0].pm_created;
      // }
      if (this.pm_type !== 'GR') {
        this.finalSubmitArray['pm_created'] = {
          created_by: Number(this.currentUser.login_id),
          created_by_name: this.currentUser.full_name,
          created_date: ''
        }
        this.finalSubmitArray['pm_approved'] = {
          approved_by: '',
          approved_by_name: '',
          approved_date: ''
        }
      }
      this.finalSubmitArray['pm_updated'] = {
        updated_by: Number(this.currentUser.login_id),
        updated_by_name: this.currentUser.full_name,
        update_date: newDate
      }
      this.finalSubmitArray['pm_vendor'] = {
        ven_id: Number(this.finalReceiptForm.value.ven_id),
        ven_name: this.finalReceiptForm.value.ven_name,
        ven_phone: this.finalReceiptForm.value.ven_contact,
        ven_email: this.finalReceiptForm.value.ven_email
      }
      this.finalSubmitArray['pm_status'] = 'pending';
      this.finalSubmitArray['pm_session'] = this.session.ses_id;
      this.finalSubmitArray['pm_details'] = {
        purchase_order_id: this.finalReceiptForm.value.po_no,
        invoice_no: this.finalReceiptForm.value.invoice_no,
        invoice_pdf: this.imageArray,
        po_total : total
      }
      console.log("final submit", this.finalSubmitArray);
      // return;
      if(this.requistionArray.length > 0 && this.requistionArray[0].pm_id){
        // this.requistionArray[0].pm_status = this.statusFlag;
        this.requistionArray[0].pm_item_details = this.finalSubmitArray['pm_item_details'];
        this.requistionArray[0].pm_vendor = this.finalSubmitArray['pm_vendor'];
        this.requistionArray[0].pm_item_details = this.finalRequistionArray;
        this.requistionArray[0].pm_intended_use = this.finalReceiptForm.value.intended_use;
        this.requistionArray[0].pm_vendor = {
          ven_id: Number(this.finalReceiptForm.value.ven_id),
          ven_name: this.finalReceiptForm.value.ven_name,
          ven_phone: this.finalReceiptForm.value.ven_contact,
          ven_email: this.finalReceiptForm.value.ven_email
        }
        this.requistionArray[0].pm_updated = {
          updated_by: Number(this.currentUser.login_id),
          updated_by_name: this.currentUser.full_name,
          update_date: newDate
        }
        console.log("hey m updating", this.requistionArray);
        // return;
        this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
          if (result) {
            printArray = result.data;
            this.inventory.updateItemQuantity(this.finalSubmitArray).subscribe((result_p: any) => {
              if (result_p) {
                let finalArray: any = [];
                finalArray.push(this.requistionArray[0]);
                console.log();
                this.commonService.showSuccessErrorMessage('Receipt Updated Successfully', 'success');
              }
            });
          }
        });
        this.requistionArray = [];
        this.router.navigate(['../procurement-master'], { relativeTo: this.route });
        this.inventory.setTabIndex({ 'currentTab': 2 });
      }else{
            this.commonService.insertRequistionMaster(this.finalSubmitArray).subscribe((result_r: any) => {
              if (result_r) {
                printArray = result_r;
                console.log("pA >>>>>>>>>",printArray, result_r);
                if($event.type == 'Save-Print'){
                  let tempDate = result_r.pm_created.created_date.split(",")[0].split(" ");
                  let prepDate = tempDate[1]+"-"+tempDate[0]+"-"+tempDate[2];
                  const JSON = {
                    "bill_id": result_r.pm_id,
                    "bill_type": "Goods Receipt Note",
                    "bill_date": prepDate,
                    "remarks": result_r.pm_intended_use,
                    "bill_created_by": result_r.pm_created.created_by_name,
                    "bill_details": result_r.pm_item_details,
                    "school_name": this.schoolInfo.school_name,
                    "school_logo": this.schoolInfo.school_logo,
                    "school_address": this.schoolInfo.school_address,
                    "school_phone": this.schoolInfo.school_phone,
                    "school_city":  this.schoolInfo.school_city,
                    "school_state":  this.schoolInfo.school_state,
                    "school_afflication_no":  this.schoolInfo.school_afflication_no,
                    "school_website":  this.schoolInfo.school_website,
                    "name": "",
                    "vendor_name": result_r.pm_vendor.ven_name,
                    "vendor_phone": result_r.pm_vendor.ven_phone,
                    "po_no": result_r.pm_details.purchase_order_id,
                    "invoice_no": result_r.pm_details.invoice_no,
                    "grand_total": result_r.pm_details.po_total,
                };
                  this.inventory.printGoodsReceipt(JSON).subscribe((result: any) => {
                    if (result) {      
                      saveAs(result.data.fileUrl, result.data.fileName);
                      this.commonService.showSuccessErrorMessage('Receipt Print Successful', 'success');
                    }
                  });
                }
                // return;
                if (this.requistionArray.length > 0) {
                  this.requistionArray[0].pm_status = this.statusFlag;
                  this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
                    if (result) {
                      printArray = result.data;
                      this.inventory.updateItemQuantity(this.finalSubmitArray).subscribe((result_p: any) => {
                        if (result_p) {
                          let finalArray: any = [];
                          result_r.pm_status = 'approved';
                          finalArray.push(result_r);
                          console.log();
                          
                          this.inventory.updateRequistionMaster(finalArray).subscribe((result_q: any) => {
                            if (result_q) {
                            
                                this.commonService.showSuccessErrorMessage('Receipt Generated Successfully', 'success');
                                this.finalSubmitArray = [];
                                this.finalRequistionArray = [];
                                this.itemCodeArray = [];
                              
                            }
                          });
                        }
                      });
                    }
                  });
                  this.requistionArray = [];
                  this.router.navigate(['../procurement-master'], { relativeTo: this.route });
                  this.inventory.setTabIndex({ 'currentTab': 2 });
                } else {
                  this.inventory.updateItemQuantity(this.finalSubmitArray).subscribe((result_p: any) => {
                    if (result_p) {
                      this.commonService.showSuccessErrorMessage('Receipt Generated Successfully', 'success');
                      this.requistionArray = [];
                      this.router.navigate(['../procurement-master'], { relativeTo: this.route });
                      this.inventory.setTabIndex({ 'currentTab': 2 });
                    }
                  });
                }
              } else {
                this.commonService.showSuccessErrorMessage('Error While Generating Receipt', 'error');
              }
            });
            console.log("printArray >>>", printArray);
          }
        }
  }
  getFilterLocation(locationData) {
    this.currentLocationId = locationData.location_id;
    this.locationDataArray.push(locationData);
  }

  getAllLocations(){
    this.locationArray = [];
    this.inventory.getAllLocations({}).subscribe((result: any) => {
      if (result) {
        console.log(result);
        console.log("all locations",result);
        this.locationArray = result;
      }
    });
}

  getLocationName(location_id) {
    const sindex = this.locationArray.findIndex(f => Number(f.location_id) === Number(location_id));
    if (sindex !== -1) {
      return this.locationArray[sindex].location_hierarchy;
    } else {
      return '-';
    }
  }
  fileChangeEvent(fileInput) {
    this.multipleFileArray = [];
    this.currentFileChangeEvent = fileInput;
    const files = fileInput.target.files;
    for (let i = 0; i < files.length; i++) {
      this.IterateFileLoop(files[i]);
    }
  }

  IterateFileLoop(files) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.currentImage = reader.result;
      const fileJson = {
        fileName: files.name,
        imagebase64: this.currentImage,
        module: 'Inventory Procurement'
      };
      this.multipleFileArray.push(fileJson);
      if (this.multipleFileArray.length === this.currentFileChangeEvent.target.files.length) {
        this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
          if (result && result.status === 'ok') {
            for (const item of result.data) {
              this.imageArray.push({
                file_name: item.file_name,
                file_url: item.file_url
              });
            }
          }
        });
      }
    };
    reader.readAsDataURL(files);
  }
  getuploadurl(fileurl: string) {
    const filetype = fileurl.substr(fileurl.lastIndexOf('.') + 1);
    if (filetype === 'pdf') {
      return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-pdf.png';
    } else if (filetype === 'doc' || filetype === 'docx') {
      return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-word.png';
    } else {
      return fileurl;
    }
  }
  deleteFile(index) {
    this.imageArray.splice(index, 1);
  }

  searchPo($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 0) {
        this.poArray = [];
        this.inventory.getRequistionMaster({ filter: $event.target.value }).subscribe((result: any) => {
          if (result) {
            this.poArray = result;

          }
        });
      }
    }
  }

  getPOPerId(item: any) {
    this.finalRequistionArray = [];
    this.requistionArray = [];
    if (item) {
      const sindex = this.requistionArray.findIndex(f => Number(f.pm_id) === Number(item.pm_id));
      if (sindex === -1) {
        this.requistionArray.push(item);
        this.getTablevalue();
      } else {
        this.getTablevalue();
      }
    }
  }
  checkQuantity(item_code, item_quantity) {    
    const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(item_code));
    if (sindex !== -1) {
      if(Number(item_quantity) > Number(this.finalRequistionArray[sindex].item_quantity)){
        this.commonService.showSuccessErrorMessage('You are not allowed to order more item quantity other than spicified one','error');
        this.createOrderForm.patchValue({
          item_quantity:this.finalRequistionArray[sindex].item_quantity,
        });
      }
    }
  }


  printGoodsReceipt(event) {
    console.log("event", event);
    if (this.finalReceiptForm.valid) {
      this.submitParam.text = 'Generate Receipt';
      this.submitParam.type = 'Save-Print';
      this.deleteModal.openModal(this.submitParam);
      this.commonService.showSuccessErrorMessage('Receipt created and saved', 'success');
    } else {
      this.commonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }
  }

}