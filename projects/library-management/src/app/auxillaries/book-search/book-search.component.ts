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
          reserv_id: Number($event.target.value)
        }
      }).subscribe((res: any) => {
        if (res && res.data) {
          for (const item of res.data) {
            item.book_container_class = 'book-title-container-default';
            this.bookData.push(item);
          }
          this.searchFlag = true;
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
  showSecondDetailDiv(index) {
    this.bookData[index].book_container_class = 'book-title-container-clicked';
  }
  showFirstDetailDiv(index) {
    this.bookData[index].book_container_class = 'book-title-container-default';
  }
  getReserv_status(id) {
    const findex = this.statusArray.findIndex(f=> f.type_id === id);
    if (findex !== -1) {
      return this.statusArray[findex].type_name;
    }
  }
}
