import { Component, OnInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SmartService } from '../../_services';

@Component({
  selector: 'app-accession-master',
  templateUrl: './accession-master.component.html',
  styleUrls: ['./accession-master.component.css']
})
export class AccessionMasterComponent implements OnInit {
  result: any = {};
  languageArray: any[] = [];
  imageFlag = false;
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
      type_id: '1',
      type_name: 'Available',
    },
    {
      type_id: '2',
      type_name: 'Issued',
    },
    {
      type_id: '3',
      type_name: 'Reserved',
    },
    {
      type_id: '4',
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
  classArray: any[] = [];
  subjectArray: any[] = [];
  vendorDetail: any = {};
  bookDetails: any = {};
  constructor(private common: ErpCommonService, private fbuild: FormBuilder,
    private smart: SmartService) { }
  assessionMasterContainer = true;
  addBookContainer = false;
  bookForm: FormGroup;
  ngOnInit() {
    this.getLanguages();
    this.getGenres();
    this.builForm();
    this.getClass();
    this.getSubject();
  }
  getClass() {
    this.smart.getClass({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.classArray = [];
        this.classArray = res.data;
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
  builForm() {
    this.bookForm = this.fbuild.group({
      isbn: '',
      title: '',
      subtitle: '',
      isbn_details: [],
      authors: [],
      publisher: '',
      tags: [],
      publishedDate: '',
      description: '',
      genre_id: '',
      images_links: [],
      lang_id: '',
      preview_link: '',
      info_link: '',
      canonical_volume_link: '',
      source: '',
      page_count: '',
      price: '',
      stack: '',
      row: '',
      buy_link: '',
      type_id: '',
      category_id: '',
      project_type_id: '6',
      reserv_class_id: [],
      reserv_status: '',
      status: '',
      reserv_sub_id: '',
      no_of_copies: '',
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
  getGenres() {
    this.common.getGenres({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.genreArray = [];
        this.genreArray = res.data;
      }
    });
  }
  addBook() {
    this.assessionMasterContainer = false;
    this.addBookContainer = true;
  }
  getBooksBasedOnISBN($event) {
    this.imageFlag = false;
    this.bookImage = '';
    if ($event.target.value) {
      this.result = {};
      this.bookDetails = {};
      this.bookDetailsArray = [];
      this.bookForm.patchValue({
        title: '',
        subtitle: '',
        isbn_details: [],
        authors: [],
        publisher: '',
        tags: [],
        publishedDate: '',
        description: '',
        genre_id: '',
        images_links: [],
        lang_id: '',
        preview_link: '',
        info_link: '',
        canonical_volume_link: '',
        source: '',
        page_count: '',
        price: '',
        stack: '',
        buy_link: '',
      });
      const method = 'get';
      const url: any = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + Number($event.target.value);
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.send();
      xhr.onloadend = () => {
        if (xhr.response && xhr.status === 200) {
          const jsonString = xhr.response
          this.result = JSON.parse(jsonString);
          this.bookDetails = this.result.items[0];
          if (Object.keys(this.bookDetails).length > 0) {
            if (this.bookDetails.volumeInfo.imageLinks.smallThumbnail) {
              this.bookImage = this.bookDetails.volumeInfo.imageLinks.smallThumbnail;
              this.imageFlag = true;
            }
            this.bookForm.patchValue({
              isbn: $event.target.value,
              title: this.bookDetails.volumeInfo.title ? this.bookDetails.volumeInfo.title : '',
              subtitle: this.bookDetails.volumeInfo.subtitle ? this.bookDetails.volumeInfo.subtitle : '',
              isbn_details: this.bookDetails.volumeInfo.industryIdentifiers ? this.bookDetails.volumeInfo.industryIdentifiers : [],
              authors: this.bookDetails.volumeInfo.authors ? this.bookDetails.volumeInfo.authors : [],
              publisher: this.bookDetails.volumeInfo.publisher ? this.bookDetails.volumeInfo.publisher : '',
              publishedDate: this.bookDetails.volumeInfo.publishedDate ? this.bookDetails.volumeInfo.publishedDate : '',
              lang_id: this.bookDetails.volumeInfo.language ? this.bookDetails.volumeInfo.language : '',
              description: this.bookDetails.volumeInfo.description ? this.bookDetails.volumeInfo.description : '',
              images_links: this.bookDetails.volumeInfo.imageLinks ? this.bookDetails.volumeInfo.imageLinks : [],
              preview_link: this.bookDetails.volumeInfo.previewLink ? this.bookDetails.volumeInfo.previewLink : '',
              page_count: this.bookDetails.volumeInfo.pageCount ? this.bookDetails.volumeInfo.pageCount : 0,
              info_link: this.bookDetails.volumeInfo.infoLink ? this.bookDetails.volumeInfo.infoLink : '',
              price: this.bookDetails.saleInfo.saleability === 'FOR_SALE' ? this.bookDetails.saleInfo.listPrice.amount : '',
              canonical_volume_link: this.bookDetails.volumeInfo.canonicalVolumeLink ? this.bookDetails.volumeInfo.canonicalVolumeLink : '',
              buy_link: this.bookDetails.saleInfo.buyLink ? this.bookDetails.saleInfo.buyLink : ''
            });
          }
        }
      };
    }
    document.getElementById('isbn_id').blur();
  }
  getLanguageName(code) {
    const findex = this.languageArray.findIndex(f => f.lang_code === code)
    if (findex !== -1) {
      return this.languageArray[findex].lang_name
    }
  }
  getGenreId(name) {
    const findex = this.genreArray.findIndex(f => f.genre_name === name)
    if (findex !== -1) {
      return this.genreArray[findex].genre_id;
    } else {
      return '';
    }
  }
  getVenderDetails($event) {
    if ($event.target.value) {
      this.common.getVendor({
        ven_id: Number($event.target.value)
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
          this.vendorDetail = {};
          this.vendorDetail = res.data[0];
          this.bookForm.patchValue({
            vendor_name: this.vendorDetail.ven_name,
            vendor_po_no: this.vendorDetail.ven_po_no,
            vendor_address: this.vendorDetail.ven_address,
            vendor_contact: this.vendorDetail.ven_contact,
            vendor_email: this.vendorDetail.ven_email,
            ven_pan_no: this.vendorDetail.ven_pan_no,
            ven_gst_no: this.vendorDetail.ven_gst_no,
            name: this.vendorDetail.ven_authorised_person_detail.name,
            desgnation: this.vendorDetail.ven_authorised_person_detail.desgnation,
            contact: this.vendorDetail.ven_authorised_person_detail.contact,
          })
        }
      })
    }
  }
  submitBook() {
    this.bookForm.value['language_details'] = {
      lang_code: this.bookDetails.volumeInfo.language ? this.bookDetails.volumeInfo.language : '',
      lang_name: this.getLanguageName(this.bookDetails.volumeInfo.language)
    };
    this.bookForm.value['genre'] = {
      genre_name: this.bookDetails.volumeInfo.categories ? this.bookDetails.volumeInfo.categories[0] : '',
      genre_id: this.getGenreId(this.bookDetails.volumeInfo.categories[0])
    };
    this.bookForm.value['location'] = this.bookForm.value.stack + '-' + this.bookForm.value.row;
    this.common.insertReservoirData({
      bookDetails: this.bookForm.value
    }).subscribe((res: any) => {
      if (res && res.data) {
      }
    });
  }
}
