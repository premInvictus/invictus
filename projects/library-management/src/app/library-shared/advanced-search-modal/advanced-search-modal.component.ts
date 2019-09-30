import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';

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
  constructor(private dialog: MatDialog, private fbuild: FormBuilder) { }
  filterArray: any[] = [
    {
      id: 'title',
      name: 'Title',
      placeholder: 'Search book by title'
    },
    {
      id: 'subtitle',
      name: 'Sub-Title',
      placeholder: 'Search book by subtitle'
    },
    {
      id: 'isbn',
      name: 'ISBN',
      placeholder: 'Search book by ISBN'
    },
    {
      id: 'reserv_id',
      name: 'Book Id',
      placeholder: 'Search book by Book Id'
    },
    {
      id: 'publisher',
      name: 'Publisher',
      placeholder: 'Search book by Publisher'
    },
    {
      id: 'published_date',
      name: 'Published Date',
      placeholder: 'Search book by Published Date'
    },
    {
      id: 'authors',
      name: 'Authors',
      placeholder: 'Search book by  Authors'
    },
    {
      id: 'tags',
      name: 'Keywords',
      placeholder: 'Search book by keywords'
    },
    {
      id: 'location',
      name: 'Location',
      placeholder: 'Search book by location'
    },
    {
      id: 'pages',
      name: 'Pages',
      placeholder: 'Search book by pages'
    }
  ];
  ngOnInit() {
  }
  openModal(data) {
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.buildForm();
  }
  setPlaceHolder(val, index) {
    const findex = this.filterArray.findIndex(f => f.id === val);
    if (findex !== -1) {
      this.placeholder[index] = this.filterArray[findex].placeholder;
    }
  }
  addNewFilter(index) {
    this.formGroupArray.push({
      id: index + 1,
      formGroup: this.fbuild.group({
        'filter_type': '',
        'filter_value': '',
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
        })
      }
    ];
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    const dataArr: any[] = [];
    for (const item of this.formGroupArray) {
      dataArr.push(item.formGroup.value);
    }
    this.searchOk.emit(dataArr);
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }

}
