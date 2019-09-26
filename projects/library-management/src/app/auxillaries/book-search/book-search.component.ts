import { Component, OnInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  searchFlag = false;
  bookData: any[] = [];
  gridView = true;
  enteredVal: any = false;
  gridViewClass = 'btn-success-blue-btn';
  listViewClass = 'default-view-button btn-spacer';
  constructor(private common: ErpCommonService) { }

  ngOnInit() {
  }
  searchBook($event) {
    if ($event.target.value) {
      this.enteredVal = true;
      this.bookData = [];
      this.common.searchReservoir({
        searchData: {
          isbn: '',
          reserv_id : Number($event.target.value)
        }
      }).subscribe((res: any) => {
        if (res && res.data) {
          this.bookData = res.data;
          this.searchFlag = true;
        }
      });
    } else {
      this.enteredVal = false;
    }
  }
  intitiateSearch() {
    document.getElementById('search_book').focus();
  }
  setView(flag) {
    this.gridView = flag;
    if (flag) {
      this.gridViewClass = 'btn-success-blue-btn';
      this.listViewClass = 'default-view-button btn-spacer';
    } else {
      this.gridViewClass = 'default-view-button';
      this.listViewClass = 'btn-success-blue-btn btn-spacer';
    }
  }
}
