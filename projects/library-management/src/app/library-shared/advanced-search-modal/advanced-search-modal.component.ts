import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

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
  genreArray: any[] = [];
  languageArray: any[] = [];
  currentUser: any = {};
  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private common: ErpCommonService) { }
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
      type_id: 'issued',
      type_name: 'Issued',
    },
    {
      type_id: 'flagged',
      type_name: 'Flagged',
    },
    {
      type_id: 'reserved',
      type_name: 'Reserved',
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
  rfIdArray: any[] = [
    {
      type_id: 'with-rfid',
      type_name: 'With RFID',
    },
    {
      type_id: 'without-rfid',
      type_name: 'Without RFID',
    },
    {
      type_id: 'all',
      type_name: 'All',
    }
  ];
  filterArray: any[] = [
  ];
  generalFilterForm: FormGroup;
  ngOnInit() {
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (Number(this.currentUser.role_id) === 2) {
      this.filterArray = [
        {
          id: 'reserv_no',
          name: 'Book No',
          type: 'text',
          placeholder: 'Search book by Book No'
        },
        {
          id: 'title',
          name: 'Title',
          type: 'text',
          placeholder: 'Search book by title'
        },
        {
          id: 'subtitle',
          name: 'Sub-Title',
          type: 'text',
          placeholder: 'Search book by subtitle'
        },
        {
          id: 'publisher',
          name: 'Publisher',
          placeholder: 'Search book by Publisher',
          type: 'text',
        },
        {
          id: 'published_date',
          name: 'Published Date',
          placeholder: 'Search book by Published Date',
          type: 'text',
        },
        {
          id: 'authors',
          name: 'Authors',
          placeholder: 'Search book by  Authors',
          type: 'text',
        },
        {
          id: 'reserv_tags',
          name: 'Keywords',
          placeholder: 'Search book by keywords',
          type: 'text',
        },
        {
          id: 'location',
          name: 'Location',
          placeholder: 'Search book by location',
          type: 'text',
        },
        {
          id: 'pages',
          name: 'Pages',
          placeholder: 'Search book by pages',
          type: 'number',
        }
      ];
    } else {
      this.filterArray = [
        {
          id: 'title',
          name: 'Title',
          type: 'text',
          placeholder: 'Search book by title'
        },
        {
          id: 'subtitle',
          name: 'Sub-Title',
          type: 'text',
          placeholder: 'Search book by subtitle'
        },
        {
          id: 'publisher',
          name: 'Publisher',
          placeholder: 'Search book by Publisher',
          type: 'text',
        },
        {
          id: 'published_date',
          name: 'Published Date',
          placeholder: 'Search book by Published Date',
          type: 'text',
        },
        {
          id: 'authors',
          name: 'Authors',
          placeholder: 'Search book by  Authors',
          type: 'text',
        },
        {
          id: 'reserv_tags',
          name: 'Keywords',
          placeholder: 'Search book by keywords',
          type: 'text',
        },
        {
          id: 'location',
          name: 'Location',
          placeholder: 'Search book by location',
          type: 'text',
        },
        {
          id: 'pages',
          name: 'Pages',
          placeholder: 'Search book by pages',
          type: 'number',
        }
      ];
    }
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.formGroupArray = [];
    this.getGenres();
    this.getLanguages();
    this.buildForm();
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
  setPlaceHolder(val, index) {
    const findex = this.filterArray.findIndex(f => f.id === val);
    if (findex !== -1) {
      this.placeholder[index] = this.filterArray[findex].placeholder;
      this.fieldType[index] = this.filterArray[findex].type;
      this.formGroupArray[index].formGroup.patchValue({
        'type': this.filterArray[findex].type
      });
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
  }
  deleteForm(i) {
    const findex = this.formGroupArray.findIndex(f => Number(f.id) === i);
    if (findex !== -1) {
      this.formGroupArray.splice(findex, 1);
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
    const obj: any = {};
    obj['type_id'] = [];
    obj['genre.genre_name'] = [];
    obj['category_id'] = [];
    obj['reserv_status'] = [];
    obj['source'] = [];
    obj['language_details.lang_code'] = [];
    obj['user'] = JSON.parse(localStorage.getItem('currentUser'));
    obj['from_date'] = '';
    obj['to_date'] = '';
    obj['rfid'] = '';
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
      from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.generalFilterForm.patchValue({
      to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }

}
