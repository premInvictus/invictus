import { Component, OnInit } from '@angular/core';
import { SisService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-change-book-status',
  templateUrl: './change-book-status.component.html',
  styleUrls: ['./change-book-status.component.css']
})
export class ChangeBookStatusComponent implements OnInit {
  reasonArray: any[] = [];
  bookData: any[] = [];
  gridView = true;
  enteredVal: any = false;
  changeStatusForm: FormGroup;
  constructor(private sis: SisService, private common: ErpCommonService,
    private fbuild: FormBuilder) { }
  statusArray: any[] = [
    {
      type_id: 'available',
      type_name: 'Available'
    },
    {
      type_id: 'read-only',
      type_name: 'Read Only'
    },
    {
      type_id: 'damaged',
      type_name: 'Damaged'
    },
    {
      type_id: 'under-maintain',
      type_name: 'Under Maintanance'
    },
    {
      type_id: 'marked-return',
      type_name: 'Marked for return'
    }
  ];
  ngOnInit() {
    this.getReasons();
    this.buildForm();
  }
  buildForm() {
    this.changeStatusForm = this.fbuild.group({
      'changed_to': '',
      'reason_id': '',
      'reason_desc': ''
    });
  }
  getReasons() {
    this.sis.getReason({ reason_type: 12 }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.reasonArray = [];
        this.reasonArray = res.data;
      }
    });
  }
  searchBook($event) {
    if ($event.target.value) {
      this.enteredVal = true;
      this.common.searchReservoir({
        searchData: {
          isbn: '',
          reserv_id: Number($event.target.value)
        }
      }).subscribe((res: any) => {
        if (res && res.data) {
          for (const item of res.data) {
            item.book_container_class = 'book-title-container-default';
            const findex = this.bookData.findIndex(f => Number(f.reserv_id) === Number($event.target.value));
            if (findex === -1) {
              this.bookData.push(item);
            }
          }
          console.log(this.bookData);
        }
      });
    } else {
      this.enteredVal = false;
    }
  }
  intitiateSearch() {
    document.getElementById('search_book').focus();
  }
  showSecondDetailDiv(index) {
    this.bookData[index].book_container_class = 'book-title-container-clicked';
  }
  showFirstDetailDiv(index) {
    this.bookData[index].book_container_class = 'book-title-container-default';
  }
  changeReservoirStatus() {
    const bookId: any[] =[];
    for (const item of this.bookData) {
      bookId.push(Number(item.reserv_id));
    }
    this.common.changeReservoirStatus({
      bookDetails: bookId,
      changedDetails: this.changeStatusForm.value
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
      }
    });
  }
}
