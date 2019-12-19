import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErpCommonService } from 'src/app/_services';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-receipt',
  templateUrl: './generate-receipt.component.html',
  styleUrls: ['./generate-receipt.component.css']
})
export class GenerateReceiptComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('messageModal') messageModal;
  multipleFileArray: any[] = [];
  imageArray: any[] = [];
  finalDocumentArray: any[] = [];
  counter: any = 0;
  currentFileChangeEvent: any;
  currentImage: any;
  UpdateFlag = false;
  submitParam: any = {};
  createOrderForm: FormGroup;
  finalReceiptForm: FormGroup;
  requistionArray: any[] = [];
  locationDataArray: any[] = [];
  finalSubmitArray: any = {};
  finalReceiptArray: any[] = [];
  setBlankArray: any[] = [];
  itemArray: any[] = [];
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
  created_date: any;
  allLocationData: any[] = [];
  isLoading = false;
  toHighlight: string = '';
  opacityClass = '';
  viewOnly = false;
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
    this.buildForm();
    if (this.inventory.getrequisitionArray()) {
      this.requistionArray = this.inventory.getrequisitionArray();
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
          // if (dety.item_status === 'approved') {
          dety.item_status = 'pending';
          const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
          if (sindex !== -1) {
            this.finalRequistionArray[sindex].item_quantity = Number(this.finalRequistionArray[sindex].item_quantity) + Number(dety.item_quantity);
          } else {
            this.itemCodeArray.push({
              item_code: dety.item_code,
            });
            this.finalRequistionArray.push(dety);
          }
          // }
        }
      }
      this.finalReceiptForm.patchValue({
        ven_id: this.ven_id,
        po_no: this.pm_id
      });
      this.vendor(this.ven_id);
    }
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
    if (this.createOrderForm.valid) {
      const sindex = this.itemCodeArray.findIndex(f => Number(f.item_code) === Number(this.createOrderForm.value.item_code));
      if (sindex !== -1) {
        this.openMessageModal();
      } else {
        this.itemCodeArray.push({
          item_code: this.createOrderForm.value.item_code,
        });
        this.createOrderForm.value.item_status = 'pending';
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
      this.inventory.setTabIndex({ 'currentTab': 1 });
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

  finalSubmit($event) {
    if ($event) {
      for (let item of this.requistionArray) {
        for (let dety of item.pm_item_details) {
          const sindex = this.finalRequistionArray.findIndex(f => Number(f.item_code) === Number(dety.item_code));
          if (sindex !== -1) {
            dety.item_status = 'approved';
          }
        }
      };
      this.finalSubmitArray['pm_item_details'] = this.finalRequistionArray;
      this.finalSubmitArray['pm_intended_use'] = this.finalReceiptForm.value.intended_use;
      this.finalSubmitArray['pm_source'] = this.finalReceiptForm.value.source;
      this.finalSubmitArray['pm_type'] = 'GR';
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
        update_date: ''
      }
      this.finalSubmitArray['pm_vendor'] = {
        ven_id: Number(this.finalReceiptForm.value.ven_id),
        ven_name: this.finalReceiptForm.value.ven_name
      }
      this.finalSubmitArray['pm_status'] = 'pending';
      this.finalSubmitArray['pm_session'] = this.session.ses_id;
      this.finalSubmitArray['pm_details'] = {
        purchase_order_id: this.finalReceiptForm.value.po_no,
        invoice_no: this.finalReceiptForm.value.invoice_no,
        invoice_pdf: this.imageArray
      }
      if (this.pm_type === 'GR') {
        this.finalSubmitArray['pm_id'] = this.pm_id;
        this.finalReceiptArray.push(this.finalSubmitArray);
        this.inventory.updateRequistionMaster(this.finalReceiptArray).subscribe((result: any) => {
          if (result) {
            this.commonService.showSuccessErrorMessage('Receipt Updated Successfully', 'success');
            this.finalSubmitArray = [];
            this.finalRequistionArray = [];
            this.itemCodeArray = [];
            this.requistionArray = [];
            this.finalReceiptArray = [];
          }
        });
      } else {
        this.commonService.insertRequistionMaster(this.finalSubmitArray).subscribe((result: any) => {
          if (result) {
            this.requistionArray[0].pm_status = 'approved';
            this.inventory.updateRequistionMaster(this.requistionArray).subscribe((result: any) => {
              if (result) {
                this.commonService.showSuccessErrorMessage('Receipt Generated Successfully', 'success');
                this.finalSubmitArray = [];
                this.finalRequistionArray = [];
                this.itemCodeArray = [];
              }
            });
            if (this.requistionArray.length > 0) {
              this.requistionArray = [];
              this.router.navigate(['../procurement-master'], { relativeTo: this.route });
              this.inventory.setTabIndex({ 'currentTab': 1 });
            } else {
              this.requistionArray = [];
              this.router.navigate(['../procurement-master'], { relativeTo: this.route });
              this.inventory.setTabIndex({ 'currentTab': 2 });
            }
          } else {
            this.commonService.showSuccessErrorMessage('Error While Generating Receipt', 'error');
          }
        });
      }

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
            this.locationDataArray.push(result[i]);
          }
        }
      });
    } else {
      this.allLocationData = [];
    }
  }
  setLocationId(locationDetails, i) {
    this.createOrderForm.patchValue({
      item_location: locationDetails.location_hierarchy,
    });
  }
  getLocationName(location_id) {
    const sindex = this.locationDataArray.findIndex(f => Number(f.location_id) === Number(location_id));
    if (sindex !== -1) {
      return this.locationDataArray[sindex].location_hierarchy;
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
}