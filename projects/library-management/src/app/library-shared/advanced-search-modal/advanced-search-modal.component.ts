import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';

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
  filterArray: any[] = [
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
      id: 'reserv_id',
      name: 'Book Id',
      type: 'number',
      placeholder: 'Search book by Book Id'
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
      id: 'tags',
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
  generalFilterForm: FormGroup;
  ngOnInit() {
  }
  openModal(data) {
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
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
    obj['language_details.lang_code'] = [];
    obj['user'] = JSON.parse(localStorage.getItem('currentUser'))
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
    this.searchOk.emit({
      filters: dataArr,
      generalFilters: this.generalFilterForm.value
    });
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }

}
