import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { SisService, SmartService, CommonAPIService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-reservoir-edit-modal',
  templateUrl: './reservoir-edit-modal.component.html',
  styleUrls: ['./reservoir-edit-modal.component.css']
})
export class ReservoirEditModalComponent implements OnInit {
  languageArray: any[] = [];
  @Output() updateReserv = new EventEmitter<any>();
  @Output() cancelUpdate = new EventEmitter<any>();
  @Input() editText;
  @ViewChild('cropModal') cropModal;
  imageFlag = false;
  @ViewChild('editReserv') editReserv;
  @ViewChild('fileInput') myInputVariable: ElementRef;
  bookImage: any = '';
  genreArray: any[] = [];
  bookDetailsArray: any[] = [];
  typeArray: any[] = [{
    type_id: '1',
    type_name: 'Hardbound',
  },
  {
    type_id: '2',
    type_name: 'Paperback',
  },
  {
    type_id: '3',
    type_name: 'ePub/eBook',
  },
  {
    type_id: '4',
    type_name: 'PDF',
  }];
  booktypeArray: any[] = [{
    type_id: '1',
    type_name: 'General',
  },
  {
    type_id: '2',
    type_name: 'Reference',
  },
  {
    type_id: '3',
    type_name: 'Periodical',
  },
  {
    type_id: '4',
    type_name: 'Sample',
  }];
  statusArray: any[] = [
    {
      type_id: 'available',
      type_name: 'Available',
    },
    {
      type_id: 'flagged',
      type_name: 'Flagged',
    }
  ];
  categoryArray: any[] = [
    {
      type_id: 'read-only',
      type_name: 'Read Only',
    },
    {
      type_id: 'damaged',
      type_name: 'Damaged',
    },
    {
      type_id: 'under-maintain',
      type_name: 'Under Maintanance',
    },
    {
      type_id: 'marked-return',
      type_name: 'Marked for return',
    }
  ];
  sourceArray: any[] = [
    {
      type_id: 'Purchased',
      type_name: 'Purchased',
    },
    {
      type_id: 'Donated',
      type_name: 'Donated',
    },
    {
      type_id: 'Gifted',
      type_name: 'Gifted',
    },
    {
      type_id: 'Specimen',
      type_name: 'Specimen',
    }
  ];
  bookForm: FormGroup;
  classArray: any[] = [];
  subjectArray: any[] = [];
  inputData: any = {};
  dialogRef: MatDialogRef<ReservoirEditModalComponent>;
  bookData: any = {};
  vendorDetail: any;
  constructor(private common: ErpCommonService, private fbuild: FormBuilder,
    private notif: CommonAPIService,
    private dialog: MatDialog,
    private sis: SisService,
    private smart: SmartService) { }

  ngOnInit() {
  }
  openModal(item) {
    this.getLanguages();
    this.getGenres();
    this.builForm();
    this.getClass();
    this.getSubject();
    this.inputData = item;
    this.dialogRef = this.dialog.open(this.editReserv, {
      width: '70%',
      height: '90vh'
    });
    this.getBookData(item.id)
  }
  getClass() {
    this.smart.getClass({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.classArray = [];
        this.classArray = res.data;
      }
    });
  }
  getBookData(id) {
    const inputJson = { 'filters': [{ 'filter_type': 'reserv_id', 'filter_value': id, 'type': 'text' }], search_from: 'master' };
    this.common.getReservoirDataBasedOnFilter(inputJson).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.bookData = {};
        this.bookData = res.data.resultData[0];
        if (this.bookData.images_links && (this.bookData.images_links.smallThumbnail || this.bookData.images_links.thumbnail)) {
          this.imageFlag = true;
          this.bookImage = this.bookData.images_links.smallThumbnail ? this.bookData.images_links.smallThumbnail :
            (this.bookData.images_links.thumbnail ? this.bookData.images_links.smallThumbnail : '')
        }
        const loc: any = this.bookData.location;
        let row, stack;
        if (loc && loc.split('-')) {
          const arr: any[] = loc.split('-');
          console.log(arr);
          row = Number(arr[1]);
          stack = arr[0];
        }
        let aut: any = '';
        if (this.bookData.authors) {
          for(const item of this.bookData.authors) {
            aut = aut + item + ',' ;
          }
          aut = aut.substring(0, aut.length -1)
        }
        this.bookForm.patchValue({
          isbn: this.bookData.isbn,
          title: this.bookData.title,
          subtitle: this.bookData.subtitle,
          authors: aut,
          publisher: this.bookData.publisher,
          tags: this.bookData.reserv_tags,
          publishedDate: this.bookData.published_date,
          genre_id: this.bookData.genre ? (this.bookData.genre.genre_name) : '',
          page_count: this.bookData.pages ? this.bookData.pages : '',
          price: this.bookData.price ? this.bookData.price : '',
          volumeInfo: this.bookData.edition,
          lang_id: this.bookData.language_details ? this.bookData.language_details.lang_code : '',
          description: this.bookData.description ? this.bookData.description : '',
          category_id: this.bookData.category_id ? this.bookData.category_id : '',
          source: this.bookData.source ? this.bookData.source : '',
          stack: stack,
          row: row,
          reserv_class_id: this.bookData.reserv_class_id ? this.bookData.reserv_class_id : [],
          reserv_sub_id: this.bookData.reserv_sub_id ? this.bookData.reserv_sub_id : [],
          vendor_id: this.bookData.vendor_details ? this.bookData.vendor_details.vendor_id : ''
        });
        this.getVenderDetails(this.bookForm.value.vendor_id);
        this.bookForm.patchValue({
          vendor_invoice_no: this.bookData.vendor_details ? this.bookData.vendor_details.vendor_invoice_no : '',
          vendor_po_no: this.bookData.vendor_details ? this.bookData.vendor_details.vendor_po_no : '',
        });
      }
    });
  }
  acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	acceptNo(event) {
		event.target.value = '';
  }
  openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);
	uploadImage(fileName, au_profileimage) {
    this.imageFlag = false;
		this.sis.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.bookImage = result.data[0].file_url;
          this.imageFlag = true;
          this.myInputVariable.nativeElement.value = '';
				} else {
          this.myInputVariable.nativeElement.value = '';
        }
			});
	}
  getSubject() {
    this.smart.getSubject({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.subjectArray = [];
        this.subjectArray = res.data;
      }
    });
  }
  getVenderDetails(val) {
    if (val) {
      this.common.getVendor({
        ven_id: Number(val)
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.vendorDetail = res.data[0];
          this.bookForm.patchValue({
            vendor_name: this.vendorDetail.ven_name,
            vendor_address: this.vendorDetail.ven_address,
            vendor_contact: this.vendorDetail.ven_contact,
            vendor_email: this.vendorDetail.ven_email,
            ven_pan_no: this.vendorDetail.ven_pan_no,
            ven_gst_no: this.vendorDetail.ven_gst_no,
            name: this.vendorDetail.ven_authorised_person_detail_name,
            desgnation: this.vendorDetail.ven_authorised_person_detail_designation,
            contact: this.vendorDetail.ven_authorised_person_detail_contact,
          });
        }
      });
    }
  }
  getVenderDetails2($event) {
    if ($event.target.value) {
      this.common.getVendor({
        ven_id: Number($event.target.value)
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.vendorDetail = res.data[0];
          this.bookForm.patchValue({
            vendor_name: this.vendorDetail.ven_name,
            vendor_address: this.vendorDetail.ven_address,
            vendor_contact: this.vendorDetail.ven_contact,
            vendor_email: this.vendorDetail.ven_email,
            ven_pan_no: this.vendorDetail.ven_pan_no,
            ven_gst_no: this.vendorDetail.ven_gst_no,
            name: this.vendorDetail.ven_authorised_person_detail_name,
            desgnation: this.vendorDetail.ven_authorised_person_detail_designation,
            contact: this.vendorDetail.ven_authorised_person_detail_contact,
          });
        } else {
          this.bookForm.value.vendor_id = this.bookData.vendor_details.vendor_id
        }
      });
    }
  }
  builForm() {
    this.bookForm = this.fbuild.group({
      isbn: '',
      title: '',
      subtitle: '',
      authors: '',
      publisher: '',
      tags: '',
      publishedDate: '',
      description: '',
      genre_id: '',
      images_links: [],
      lang_id: '',
      source: '',
      page_count: '',
      price: '',
      stack: '',
      row: '',
      buy_link: '',
      category_id: '',
      project_type_id: '6',
      reserv_class_id: [],
      reserv_sub_id: '',
      vendor_id: '',
      vendor_name: '',
      vendor_po_no: '',
      volumeInfo: '',
      vendor_invoice_no: '',
      vendor_address: '',
      vendor_contact: '',
      vendor_email: '',
      name: '',
      desgnation: '',
      contact: '',
      ven_gst_no: '',
      ven_pan_no: ''
    });
  }
  getLanguages() {
    this.common.getLanguages({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.languageArray = [];
        this.languageArray = res.data;
      }
    });
  }
  readUrl(event: any) {
		this.openCropDialog(event);
	}
  getGenres() {
    this.common.getGenres({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.genreArray = [];
        this.genreArray = res.data;
      }
    });
  }
  update() {
    if (this.bookForm.valid) {
      if(this.bookImage) {
        this.bookForm.value['bookImage'] = this.bookImage;
        this.bookForm.value['reserv_id'] = this.bookData.reserv_id;
      }
    this.updateReserv.emit(this.bookForm);
    this.closeDialog();
    }
  }
  cancel() {
    this.cancelUpdate.emit(this.inputData);
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
