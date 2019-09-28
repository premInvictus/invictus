import { Component, OnInit } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  bookDetailsArray: any[] = [];
  result: any = {};
  constructor(private common: ErpCommonService) { }
  ngOnInit() {
    this.getBooksBasedOnISBN();
  }
  getBooksBasedOnISBN() {
    this.result = {};
    this.bookDetailsArray = [];
    const method = 'get';
    const url: any = 'https://www.googleapis.com/books/v1/volumes?q=isbn:9781616554743';
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.send();
    xhr.onloadend = () => {
      if (xhr.response && xhr.status === 200) {
        const jsonString = xhr.response
        this.result = JSON.parse(jsonString);
        this.bookDetailsArray = [];
        console.log(this.result);
        for (const item of this.result.items) {
          this.bookDetailsArray.push({
            isbn: '9781616554743',
            title: item.volumeInfo.title ? item.volumeInfo.title : '',
            subtitle: item.volumeInfo.subtitle ? item.volumeInfo.subtitle : '',
            isbn_details: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers : [],
            authors: item.volumeInfo.authors ? item.volumeInfo.authors : [],
            publisher: item.volumeInfo.publisher ? item.volumeInfo.publisher : '',
            publisher_date: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate : '',
            description: item.volumeInfo.description ? item.volumeInfo.description : '',
            images_links: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks : [],
            language_details: {
              lang_code: item.volumeInfo.language ? item.volumeInfo.language : '',
              lang_name: 'English'
            },
            preview_link: item.volumeInfo.previewLink ? item.volumeInfo.previewLink : '',
            page_count: item.volumeInfo.pageCount ? item.volumeInfo.pageCount : 0,
            info_link: item.volumeInfo.infoLink ? item.volumeInfo.infoLink : '',
            print_type: '1',
            price: item.saleInfo.saleability === 'FOR_SALE' ? item.saleInfo.listPrice.amount : '',
            canonical_volume_link: item.volumeInfo.canonicalVolumeLink ? item.volumeInfo.canonicalVolumeLink : '',
            buy_link: item.saleInfo.buyLink ? item.saleInfo.buyLink : ''
          })
        }
        console.log(this.bookDetailsArray);
        // this.common.insertReservoirData({
        //   bookDetails: this.bookDetailsArray
        // }).subscribe((res: any) => {
        //   if (res && res.status === 'ok') {
        //     console.log(res);
        //   }
        // });
      }
    };

  }
}
